// pv-threePearl.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";
import { PVHandle } from "./pv-handle.js";

// ThreePearl
// Pure rendering engine: scene, camera, renderer, controls, primitives.
export class ThreePearl {

    constructor(canvas, domain) {
        this.canvas = canvas;
        this.myDomain = domain;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setScissorTest(true);

        // Scene
        this.scene = new THREE.Scene();

        // Camera + frustum parameters
        this.orthoHalfHeight = 2.5;
        this.cameraZoom = 1.0;
        this.axisOverlayLength = 1.4;
        this.axisOverlayMargin = 0.35;

        this.camera = new THREE.OrthographicCamera(
            -10, 10,
            10, -10,
            0.1, 1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        this._updateOrthographicFrustum();

        // Axis overlay
        this.axisOverlay = this._createAxisOverlay();
        this.scene.add(this.axisOverlay);

        // Controls
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

        // Root/content groups
        this.root = new THREE.Group();
        this.content = new THREE.Group();
        this.root.add(this.content);
        this.scene.add(this.root);

        // Light
        const light = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(light);
    }

    // Frustum update
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

    // Axis overlay position
    _updateAxisOverlayPosition() {
        if (!this.axisOverlay) return;

        this.axisOverlay.position.set(
            this.camera.left + this.axisOverlayMargin,
            this.camera.top - this.axisOverlayMargin - this.axisOverlayLength,
            this.controls?.target?.z ?? 0
        );
    }

    // Physics Z → Three.js Z
    _toThreeZ(physicsZ = 0) {
        return -physicsZ;
    }

    // Axis overlay (generic XYZ)
    _createAxisOverlay() {
        const group = new THREE.Group();
        group.renderOrder = 1000;

        const axisLength = this.axisOverlayLength;
        const axesMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.95,
            depthTest: false
        });

        const axisSpecs = [
            { vector: new THREE.Vector3(axisLength, 0, 0), color: 0xff8888, label: "X", position: new THREE.Vector3(0.95, 0.08, 0) },
            { vector: new THREE.Vector3(0, axisLength, 0), color: 0x88ff88, label: "Y", position: new THREE.Vector3(-0.08, 0.95, 0) },
            { vector: new THREE.Vector3(0, 0, this._toThreeZ(axisLength)), color: 0x8888ff, label: "Z", position: new THREE.Vector3(-0.08, -0.08, this._toThreeZ(0.95)) }
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

    // Primitives
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

    makeTriangularPrism(params) {
        return this.makeTrianglePrism(params);
    }

    // Basic transforms
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
        if (!this.initialCameraState) return;

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

    // Rendering
    render() {
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        this.renderer.setSize(width, height, false);
        this._updateOrthographicFrustum(width, height);

        this.renderer.setViewport(0, 0, width, height);
        this.renderer.setScissor(0, 0, width, height);
        this.renderer.setScissorTest(true);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
