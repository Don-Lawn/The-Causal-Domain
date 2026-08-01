// threePearl.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js';
import { PVHandle } from "./pv-handle.js";

export class ThreePearl {

    constructor(canvas, domain) {
        this.canvas = canvas;
        this.myDomain = domain;

        // Domain-local renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setScissorTest(true);

        // Domain-local scene
        this.scene = new THREE.Scene();

        // Domain-local camera (your orthographic setup preserved)
        this.camera = new THREE.OrthographicCamera(
            -20, 20,
            20, -20,
            0.1, 1000
        );

        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        this.cameraLiftTarget = Math.PI / 4;
        this.cameraLiftStartPhase = 2 * Math.PI;
        this.cameraLiftEndPhase = 22 * Math.PI;

        this.camera.left   = -5;
        this.camera.right  =  5;
        this.camera.top    =  5;
        this.camera.bottom = -5;
        this.camera.zoom = 1.0;
        this.camera.updateProjectionMatrix();

        this.axisOverlay = this._createAxisOverlay(this.myDomain?.name || "XYZ");
        this.root.add(this.axisOverlay);

        // Domain-local controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.target.set(0, 0, 0);

        // Domain-local root/content groups
        this.root = new THREE.Group();
        this.content = new THREE.Group();
        this.root.add(this.content);
        this.scene.add(this.root);

        // Domain-local light
        const light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(5, 5, 5);
        this.scene.add(light);
    }

    _createAxisOverlay(label) {
        const group = new THREE.Group();
        group.position.set(-3.2, 2.8, -1.0);

        const axesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
        const xGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.8, 0, 0)
        ]);
        const yGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0.8, 0)
        ]);
        const zGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 0.8)
        ]);

        const xAxis = new THREE.Line(xGeom, axesMaterial.clone());
        xAxis.material.color.set(0xff8888);
        const yAxis = new THREE.Line(yGeom, axesMaterial.clone());
        yAxis.material.color.set(0x88ff88);
        const zAxis = new THREE.Line(zGeom, axesMaterial.clone());
        zAxis.material.color.set(0x8888ff);

        group.add(xAxis, yAxis, zAxis);

        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 60;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.font = "bold 24px sans-serif";
            ctx.fillText(label, 8, 34);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(0.8, 1.15, 0);
        sprite.scale.set(2.0, 0.7, 1);
        group.add(sprite);

        return group;
    }

    // ------------------------------------------------------------
    // Primitives (unchanged)
    // ------------------------------------------------------------

    makeCylinder(params) {
        const geom = new THREE.CylinderGeometry(
            params.radiusTop,
            params.radiusBottom,
            params.height,
            32
        );
        const mat = new THREE.MeshBasicMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);
        return new PVHandle(mesh);
    }


    makeCone(params) {
        const geom = new THREE.ConeGeometry(
            params.radius,
            params.height,
            32
        );
        const mat = new THREE.MeshBasicMaterial({ color: params.color });
        const mesh = new THREE.Mesh(geom, mat);
        return new PVHandle(mesh);
    }


    makeSphere({ radius = 1, color = 0xffffff }) {
        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        return new PVHandle(mesh);
    }


    setPosition(handle, pos) {
        handle.impl.position.set(pos.x, pos.y, pos.z);
    }

    setRotationZ(handle, radians) { handle.impl.rotation.z = radians; }
    setRotationX(handle, radians) { handle.impl.rotation.x = radians; }
    setRotationY(handle, radians) { handle.impl.rotation.y = radians; }

    setVisibility(handle, visible) {
        handle.impl.visible = visible;
    }

    combine(handles) {
        const group = new THREE.Group();
        for (const h of handles) group.add(h.impl);
        return new PVHandle(group);
    }

    attachToDomain(handle) {
        this.content.add(handle.impl);
    }

    // ------------------------------------------------------------
    // Trails (unchanged)
    // ------------------------------------------------------------

    updateTrail(handle, semanticObject) {
        const ghost = handle.impl.clone(true);

        ghost.traverse(node => {
            if (node.material) {
                node.material = node.material.clone();
                node.material.transparent = true;
                node.material.opacity = 1.0;
            }
        });

        this.scene.add(ghost);
        handle.trail.push(ghost);

        if (semanticObject.trailFadeEnabled === false) {
            return;
        }

        for (let i = handle.trail.length - 1; i >= 0; i--) {
            const g = handle.trail[i];

            g.scale.multiplyScalar(0.998);

            g.traverse(node => {
                if (node.material) {
                    node.material.opacity -= semanticObject.fadeRate;
                }
            });

            const first = g.children[0];
            if (first && first.material.opacity <= 0) {
                this.scene.remove(g);
                handle.trail.splice(i, 1);
            }
        }
    }

    applyColor(handle, r, g, b) {
        const color = new THREE.Color(r, g, b);
        handle.impl.children.forEach(child => {
            if (child.material) child.material.color.copy(color);
        });
    }

    updateCamera(dt, semanticObject) {
        if (!semanticObject) {
            return;
        }

        const domainName = this.myDomain?.name;
        if (domainName !== "ABZ" && domainName !== "XYZ") {
            return;
        }

        const phase = semanticObject.phase ?? 0;
        const radius = 10;

        if (phase < this.cameraLiftStartPhase) {
            this.camera.position.set(0, 0, radius);
            this.camera.lookAt(0, 0, 0);
            return;
        }

        const liftSpan = Math.max(this.cameraLiftEndPhase - this.cameraLiftStartPhase, 0.0001);
        const liftRatio = Math.min(1, Math.max(0, (phase - this.cameraLiftStartPhase) / liftSpan));
        const cameraTilt = liftRatio * this.cameraLiftTarget;

        const x = Math.sin(cameraTilt) * radius;
        const y = Math.cos(cameraTilt) * radius * 0.35;
        const z = Math.cos(cameraTilt) * radius;

        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    // ------------------------------------------------------------
    // Rendering (rewritten)
    // ------------------------------------------------------------

    render() {
        // Use the full canvas extent — no panelRect, no offsets
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Resize renderer only if needed
        this.renderer.setSize(width, height, false);

        // Update camera aspect
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Full-canvas viewport
        this.renderer.setViewport(0, 0, width, height);
        this.renderer.setScissor(0, 0, width, height);
        this.renderer.setScissorTest(true);

        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // ------------------------------------------------------------
    // Mesh creation (unchanged)
    // ------------------------------------------------------------

    createMeshFor(semanticObject) {
        let handle = null;

        switch (semanticObject.type) {
            case "PhaseArrow":
                handle = this._createPhaseArrowMesh(semanticObject);
                break;
            case "Sphere":
                handle = this.makeSphere(semanticObject);
                break;
            default:
                console.warn(`Unsupported semantic object type: ${semanticObject.type}`);
                return null;
        }

        if (!handle) {
            return null;
        }

        return handle;
    }

    _createPhaseArrowMesh(obj) {
        const shaftLength = 1;
        const shaftRadius = 0.05;
        const headLength = 0.15;
        const headRadius = 0.10;

        const shaft = this.makeCylinder({
            radiusTop: shaftRadius,
            radiusBottom: shaftRadius,
            height: shaftLength,
            color: 0xff0000
        });
        this.setPosition(shaft, {
            x: 0,
            y: shaftLength / 2,
            z: 0
        });

        const head = this.makeCone({
            radius: headRadius,
            height: headLength,
            color: 0xff0000
        });
        this.setPosition(head, {
            x: 0,
            y: shaftLength + headLength / 2,
            z: 0
        });

        return this.combine([shaft, head]);
    }
}
