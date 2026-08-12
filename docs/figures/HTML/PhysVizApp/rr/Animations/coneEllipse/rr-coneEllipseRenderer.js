// rr/coneEllipse/rr-coneEllipseRenderer.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PVHandle } from "../../../pv-handle.js";
import { RendererBase } from "../../../pv-rendererBase.js";

const CONE_RADIAL_SEGMENTS = 39;
const CONE_HEIGHT_SEGMENTS = 18;
const CONE_WIRE_HEIGHT_SEGMENTS = 9;

class RRConeEllipseRenderer extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    createHandle(semanticObject) {
        const handle = new PVHandle(new THREE.Group());
        this.handles.set(semanticObject.id, handle);
        return handle;
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;

        const group = new THREE.Group();

        const coneSolid = new THREE.Mesh(
            new THREE.ConeGeometry(1, 1, CONE_RADIAL_SEGMENTS, CONE_HEIGHT_SEGMENTS),
            new THREE.MeshBasicMaterial({
                color: 0x5ca7ff,
                transparent: true,
                opacity: 0.23,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );

        const coneWire = new THREE.Mesh(
            new THREE.ConeGeometry(1, 1, CONE_RADIAL_SEGMENTS, CONE_WIRE_HEIGHT_SEGMENTS),
            new THREE.MeshBasicMaterial({
                color: 0x9fd0ff,
                wireframe: true,
                transparent: true,
                opacity: 0.25,
                depthWrite: false
            })
        );

        const ellipse = new THREE.LineLoop(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({ color: 0xffb347 })
        );

        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(0.055, 20, 14),
            new THREE.MeshBasicMaterial({ color: 0xff5f6d })
        );

        group.add(coneSolid);
        group.add(coneWire);
        group.add(ellipse);
        group.add(marker);

        if (this.domain?.name === "VQTOP") {
            coneSolid.visible = false;
            coneWire.visible = true;
            ellipse.visible = false;
            marker.visible = false;
        }

        handle.impl = group;
        handle.coneSolid = coneSolid;
        handle.coneWire = coneWire;
        handle.ellipse = ellipse;
        handle.marker = marker;
        handle.lastConeRadius = null;
        handle.lastConeHeight = null;

        this.pearl.attachToDomain(handle);
        handle.geometryBuilt = true;
    }

    render(semanticObject, hints) {
        super.render(semanticObject, hints);

        const handle = this.ensureHandle(semanticObject);
        if (this.domain?.name === "VQTOP") {
            this.updateTopDomainCone(handle);
            return;
        }

        this.updateCone(handle, hints);
        this.updateEllipse(handle, hints);
        this.updateMarker(handle, hints);
    }

    setPosition(handle, hints) {
        if (this.domain?.name === "VQTOP") {
            // Lift by +0.5 in physics depth so rotated cone apex lands at Q=0 (Three Z=0).
            this.pearl.setPosition(handle, { x: 0, y: 0, z: 0.5 });
            return;
        }

        this.pearl.setPosition(handle, { x: 0, y: 0, z: 0 });
    }

    setRotationZ(handle, hints) {
        if (this.domain?.name === "VQTOP") {
            this.pearl.setRotationX(handle, Math.PI / 2);
            this.pearl.setRotationZ(handle, 0);
            return;
        }

        this.pearl.setRotationX(handle, 0);
        this.pearl.setRotationZ(handle, 0);
    }

    applyColor(handle, hints) {
        return;
    }

    updateTopDomainCone(handle) {
        const radius = 1;
        const height = 1;

        if (handle.lastConeRadius === radius && handle.lastConeHeight === height) {
            return;
        }

        if (handle.coneSolid.geometry) {
            handle.coneSolid.geometry.dispose();
        }
        if (handle.coneWire.geometry) {
            handle.coneWire.geometry.dispose();
        }

        handle.coneSolid.geometry = new THREE.ConeGeometry(radius, height, CONE_RADIAL_SEGMENTS, CONE_HEIGHT_SEGMENTS);
        handle.coneWire.geometry = new THREE.ConeGeometry(radius, height, CONE_RADIAL_SEGMENTS, CONE_WIRE_HEIGHT_SEGMENTS);

        handle.coneSolid.visible = false;
        handle.coneWire.visible = true;

        handle.coneWire.material = new THREE.MeshBasicMaterial({
            color: 0x4a90ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            depthWrite: false
        });
        handle.lastConeRadius = radius;
        handle.lastConeHeight = height;
    }

    updateCone(handle, hints) {
        const cone = hints.cone;
        if (!cone) return;

        const radius = Math.max(cone.radiusBottom ?? 0.0001, 0.0001);
        const height = Math.max(cone.height ?? 0.0001, 0.0001);

        if (handle.lastConeRadius === radius && handle.lastConeHeight === height) {
            return;
        }

        [handle.coneSolid, handle.coneWire].forEach((mesh) => {
            if (mesh.geometry) {
                mesh.geometry.dispose();
            }

            const heightSegments = mesh === handle.coneWire ? CONE_WIRE_HEIGHT_SEGMENTS : CONE_HEIGHT_SEGMENTS;
            const geometry = new THREE.ConeGeometry(radius, height, CONE_RADIAL_SEGMENTS, heightSegments);
            // Three.js cone points +Y. Rotate/translate so apex is at origin and axis is +Z.
            geometry.rotateX(-Math.PI / 2);
            geometry.translate(0, 0, height / 2);
            mesh.geometry = geometry;
        });

        handle.lastConeRadius = radius;
        handle.lastConeHeight = height;
    }

    updateEllipse(handle, hints) {
        const ellipse = hints.ellipse;
        if (!ellipse || !Array.isArray(ellipse.samples) || ellipse.samples.length < 3) {
            return;
        }

        const positions = new Float32Array(ellipse.samples.length * 3);
        ellipse.samples.forEach((p, i) => {
            positions[i * 3 + 0] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
        });

        if (handle.ellipse.geometry) {
            handle.ellipse.geometry.dispose();
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        handle.ellipse.geometry = geometry;
    }

    updateMarker(handle, hints) {
        const marker = hints.marker;
        const position = marker?.position;
        if (!position) {
            return;
        }

        handle.marker.position.set(position.x, position.y, position.z);

        const radius = Math.max(marker.radius ?? 0.04, 0.01);
        const currentRadius = handle.marker.geometry?.parameters?.radius;
        if (currentRadius !== radius) {
            handle.marker.geometry.dispose();
            handle.marker.geometry = new THREE.SphereGeometry(radius, 20, 14);
        }
    }
}

export { RRConeEllipseRenderer };
