// rr/coneEllipse/rr-gravityWellRenderer.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PVHandle } from "../../../pv-handle.js";
import { RendererBase } from "../../../pv-rendererBase.js";

class RRGravityWellRenderer extends RendererBase {
    constructor(domain, pearl) {
        super(domain, pearl);
    }

    circularityFunction(r, hints) {
        const c = hints.circularityFactor ?? 1.0;
        return Math.max(0, c);
    }

    createHandle(semanticObject) {
        const material = new THREE.MeshBasicMaterial({
            color: 0x4a90ff,
            wireframe: true,
            transparent: true,
            opacity: 0.25,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(new THREE.LatheGeometry([], 8), material);
        const handle = new PVHandle(mesh);

        handle.lastKey = "";
        this.pearl.attachToDomain(handle);
        this.handles.set(semanticObject.id, handle);
        return handle;
    }

    ensureGeometry(handle) {
        if (handle.geometryBuilt) return;
        handle.geometryBuilt = true;
    }

    render(semanticObject, hints) {
        super.render(semanticObject, hints);
        const handle = this.ensureHandle(semanticObject);
        this.updateWellGeometry(handle, hints);
        this.updateMaterial(handle, hints);
    }

    setPosition(handle, hints) {
        this.pearl.setPosition(handle, { x: 0, y: 0, z: 0 });
    }

    setRotationZ(handle, hints) {
        const xRotationDeg = Number.isFinite(hints.xRotationDeg) ? hints.xRotationDeg : 90;
        this.pearl.setRotationX(handle, xRotationDeg * Math.PI / 180);
        this.pearl.setRotationY(handle, 0);
        this.pearl.setRotationZ(handle, 0);
    }

    updateWellGeometry(handle, hints) {
        const strength = Math.max(hints.strength ?? 1.0, 0.0001);
        const circularityFactor = Math.max(hints.circularityFactor ?? 1.0, 0);
        const rMin = Math.max(hints.rMin ?? 0.35, 0.001);
        const rMax = Math.max(hints.rMax ?? 2.0, rMin + 0.001);
        const radialSamples = Math.max(16, Math.floor(hints.radialSamples ?? 160));
        const segments = Math.max(16, Math.floor(hints.segments ?? 128));

        const key = `${strength}|${circularityFactor}|${rMin}|${rMax}|${radialSamples}|${segments}`;
        if (key === handle.lastKey) {
            return;
        }

        const profile = [];
        const dr = (rMax - rMin) / (radialSamples - 1);
        for (let i = 0; i < radialSamples; i += 1) {
            const r = rMin + i * dr;
            const c = this.circularityFunction(r, hints);
            const q = -(strength / (r * r)) * c;
            const zThree = -q;
            profile.push(new THREE.Vector2(r, zThree));
        }

        if (handle.impl.geometry) {
            handle.impl.geometry.dispose();
        }
        handle.impl.geometry = new THREE.LatheGeometry(profile, segments);
        handle.lastKey = key;
    }

    updateMaterial(handle, hints) {
        const style = (hints.style || "wireframe").toLowerCase();
        const color = hints.color ?? 0x4a90ff;
        const opacity = Math.max(0, Math.min(1, hints.opacity ?? 0.25));

        if (style === "shaded") {
            handle.impl.material = new THREE.MeshStandardMaterial({
                color,
                roughness: 0.6,
                metalness: 0.15,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            return;
        }

        handle.impl.material = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity,
            side: THREE.DoubleSide,
            depthWrite: false
        });
    }

    applyColor(handle, hints) {
        return;
    }
}

export { RRGravityWellRenderer };
