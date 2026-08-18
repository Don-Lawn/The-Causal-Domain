   // Axis overlay (generic XYZ)

    
    import { PVHandle } from "../pv-handle.js";
    import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function createAxisOverlay() {
    const group = new THREE.Group();
    group.renderOrder = 1000;

    const axisLength = this.axisOverlayLength;
    const axesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.95,
        depthTest: false
    });

    // NEW: labels come from hints, with fallback
    const labels = this.hints?.axisOverlay?.labels ?? ["X", "Y", "Z"];

    const axisSpecs = [
        { vector: new THREE.Vector3(axisLength, 0, 0), color: 0xff8888, label: labels[0], position: new THREE.Vector3(0.95, 0.08, 0) },
        { vector: new THREE.Vector3(0, axisLength, 0), color: 0x88ff88, label: labels[1], position: new THREE.Vector3(-0.08, 0.95, 0) },
        { vector: new THREE.Vector3(0, 0, this._toThreeZ(axisLength)), color: 0x8888ff, label: labels[2], position: new THREE.Vector3(-0.08, -0.08, this._toThreeZ(0.95)) }
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

export function createAxisLabelSprite(text, color, position) {
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

export function updateAxisOverlayPosition() {
    if (!this.axisOverlay) return;

    this.axisOverlay.position.set(
        this.camera.left + this.axisOverlayMargin,
        this.camera.top - this.axisOverlayMargin - this.axisOverlayLength,
        this.controls?.target?.z ?? 0
    );
}

