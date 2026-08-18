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

        this.orthoHalfHeight = 2.5;
        this.cameraZoom = 1.0;
        this.axisOverlayLength = 1.4;
        this.axisOverlayMargin = 0.35;

        // Domain-local camera (your orthographic setup preserved)
        this.camera = new THREE.OrthographicCamera(
            -10, 10,
            10, -10,
            0.1, 1000
        );

        const domainName = (this.myDomain?.name || "").toUpperCase();

        this.camera.position.set(0, 0, 5);
        if (domainName === "XYZ") {
            this.camera.position.set(4.0, 1.8, 10);
        } else if (domainName === "VQTOP") {
            this.orthoHalfHeight = 1.2;
            this.camera.position.set(0.5, -8.0, 0.5);
            this.camera.up.set(0, 0, 1);
            this.camera.lookAt(0.5, 0, 0.5);
            // Oblique causal-domain view: ~30 deg above the Wx/Wy plane.
            this.camera.position.set(0.5, -6.93, 4.0);
            this.camera.up.set(0, 1, 0);
            this.camera.lookAt(0.5, 0, 0);
        } else if (domainName === "ZQVIEW") {
            this.orthoHalfHeight = 1.2;
            // Keep V orientation consistent with VQTOP.
            this.camera.position.set(0.5, 0, 8.0);
            // Oblique phenomenal-domain view: ~30 deg above the XY plane.
            this.camera.position.set(0.5, 6.93, 4.0);
            this.camera.up.set(0, 1, 0);
            this.camera.lookAt(0.5, 0, 0);
        }

        if (domainName !== "VQTOP" && domainName !== "ZQVIEW") {
            this.camera.lookAt(0, 0, 0);
            this.camera.up.set(0, 1, 0);
        }

        this.cameraLiftTarget = Math.PI / 4;
        this.cameraLiftStartTurns = 2;
        this.cameraLiftEndTurns = this.cameraLiftStartTurns + 10;
        this.cameraLiftStartPhase = this.cameraLiftStartTurns * 2 * Math.PI;
        this.cameraLiftEndPhase = this.cameraLiftEndTurns * 2 * Math.PI;

        this._updateOrthographicFrustum();

        this.axisOverlay = this._createAxisOverlay(this.myDomain?.name || "XYZ");
        this.scene.add(this.axisOverlay);

        // Domain-local controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = false;
        this.controls.target.set(0, 0, 0);
        this._updateAxisOverlayPosition();
        this.initialCameraState = {
            position: this.camera.position.clone(),
            target: this.controls.target.clone(),
            up: this.camera.up.clone(),
            zoom: this.camera.zoom
        };

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

    _updateOrthographicFrustum(width = this.canvas.clientWidth, height = this.canvas.clientHeight) {
        const safeWidth = Math.max(width || 1, 1);
        const safeHeight = Math.max(height || 1, 1);
        const aspect = safeWidth / safeHeight;

        this.camera.left = -this.orthoHalfHeight * aspect;
        this.camera.right = this.orthoHalfHeight * aspect;
        this.camera.top = this.orthoHalfHeight;
        this.camera.bottom = -this.orthoHalfHeight;
        this.camera.zoom = this.cameraZoom;
        this.camera.updateProjectionMatrix();

        this._updateAxisOverlayPosition();
    }

    _updateAxisOverlayPosition() {
        if (!this.axisOverlay) {
            return;
        }

        this.axisOverlay.position.set(
            this.camera.left + this.axisOverlayMargin,
            this.camera.top - this.axisOverlayMargin - this.axisOverlayLength,
            this.controls?.target?.z ?? 0
        );
    }

    _toThreeZ(physicsZ = 0) {
        // Physics convention: +Z goes into the screen. Three.js: +Z comes out.
        return -physicsZ;
    }

    _createAxisOverlay(domainName) {
        const group = new THREE.Group();
        group.renderOrder = 1000;

        const axisLength = this.axisOverlayLength;
        const axesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthTest: false });
        const axisLabels = this._getAxisLabels(domainName);

        const axisSpecs = [
            { vector: new THREE.Vector3(axisLength, 0, 0), color: 0xff8888, label: axisLabels[0], position: new THREE.Vector3(0.95, 0.08, 0) },
            { vector: new THREE.Vector3(0, axisLength, 0), color: 0x88ff88, label: axisLabels[1], position: new THREE.Vector3(-0.08, 0.95, 0) },
            { vector: new THREE.Vector3(0, 0, this._toThreeZ(axisLength)), color: 0x8888ff, label: axisLabels[2], position: new THREE.Vector3(-0.08, -0.08, this._toThreeZ(0.95)) }
        ];

        axisSpecs.forEach(spec => {
            const geom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                spec.vector
            ]);
            const axis = new THREE.Line(geom, axesMaterial.clone());
            axis.material.color.set(spec.color);
            axis.material.depthTest = false;
            axis.renderOrder = 1000;
            group.add(axis);

            const labelSprite = this._createAxisLabelSprite(spec.label, spec.color, spec.position);
            group.add(labelSprite);
        });

        return group;
    }

    _getAxisLabels(domainName) {
        const normalized = (domainName || "").toUpperCase();
        if (normalized.includes("VQTOP")) {
            return ["V", "Y", "Q"];
            return ["Wx", "Wy", "Q"];
        }
        if (normalized.includes("ZQVIEW")) {
            return ["V", "Y", "Q"];
            return ["Rx", "Ry", "Z"];
        }
        if (normalized.includes("ABC")) {
            return ["A", "B", "C"];
        }
        if (normalized.includes("ABZ")) {
            return ["A", "B", "Z"];
        }
        return ["X", "Y", "Z"];
    }

    _createAxisLabelSprite(text, color, position) {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
            ctx.font = "bold 18px sans-serif";
            ctx.fillText(text, 6, 22);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.scale.set(0.7, 0.35, 1);
        return sprite;
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

    makeBox({ width = 1, height = 1, depth = 1, color = 0xffffff }) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        return new PVHandle(mesh);
    }

    makeTrianglePrism({ width = 1, height = 1, depth = 0.02, color = 0xffffff }) {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2, -height / 2);
        shape.lineTo(-width / 2, height / 2);
        shape.lineTo(width / 2, 0);
        shape.closePath();

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth,
            bevelEnabled: false
        });
        geometry.translate(0, 0, -depth / 2);

        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        return new PVHandle(mesh);
    }


    setPosition(handle, pos) {
        handle.impl.position.set(pos.x, pos.y, this._toThreeZ(pos.z));
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

 

    resetCamera() {
        if (!this.initialCameraState) {
            return;
        }

        this.camera.position.copy(this.initialCameraState.position);
        this.camera.up.copy(this.initialCameraState.up);
        this.camera.zoom = this.initialCameraState.zoom;
        this.camera.updateProjectionMatrix();

        if (this.controls) {
            this.controls.target.copy(this.initialCameraState.target);
            this.controls.update();
        }

        this._updateAxisOverlayPosition();
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

        const cameraDelta = semanticObject.cameraDelta;
        if (!cameraDelta) {
            return;
        }

        if (!cameraDelta.active) {
            return;
        }

        const positionDelta = cameraDelta.positionDelta || { x: 0, y: 0, z: 0 };
        const targetZDelta = cameraDelta.targetZDelta ?? 0;

        this.camera.position.x += positionDelta.x;
        this.camera.position.y += positionDelta.y;
        this.camera.position.z += this._toThreeZ(positionDelta.z + targetZDelta);

        this.controls.target.z += this._toThreeZ(targetZDelta);
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

        // Orthographic magnification comes from frustum size and zoom, not camera distance.
        this._updateOrthographicFrustum(width, height);

        // Full-canvas viewport
        this.renderer.setViewport(0, 0, width, height);
        this.renderer.setScissor(0, 0, width, height);
        this.renderer.setScissorTest(true);

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
