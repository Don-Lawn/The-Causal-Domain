// rr-abc.js
// Causal domain: phase circle + rotating arrow + radial billboard
import * as THREE from 'three';
import {
    RRPalette,
    RRLayout,
    makeBillboard,
    makeRadialTexture,
    phase
} from './rr-core.js';

export function initState() {
    return {
        phaseSpeed: 1.0
    };
}

export function build(scene) {

    const group = new THREE.Group();
    group.position.set(
        RRLayout.abcPos.x,
        RRLayout.abcPos.y,
        RRLayout.abcPos.z
    );
    scene.add(group);

    // ===== BILLBOARD PANEL =====
    const radialTex = makeRadialTexture(RRPalette.causal);

    const panel = makeBillboard({
        texture: radialTex,
        color: RRPalette.causal,
        width: RRLayout.panelSize.wTop,
        height: RRLayout.panelSize.hTop,
        opacity: 0.12
    });
    panel.rotation.y = Math.PI;

    panel.position.set(0, 0, -0.01); // slight offset behind geometry
    group.add(panel);

    // ===== PHASE CIRCLE =====
    const circleGeo = new THREE.CircleGeometry(0.8, 128);
    const circleMat = new THREE.MeshBasicMaterial({
        color: RRPalette.causal,
        transparent: true,
        opacity: 0.25
    });
    const circle = new THREE.Mesh(circleGeo, circleMat);
    group.add(circle);

    // ===== ROTATING ARROW =====
    const arrowLen = 0.8;
    const arrowDir = new THREE.Vector3(1, 0, 0);
    const arrowOrigin = new THREE.Vector3(0, 0, 0);
    const arrow = new THREE.ArrowHelper(
        arrowDir,
        arrowOrigin,
        arrowLen,
        RRPalette.causal
    );
    arrow.rotation.x = -Math.PI / 2; // same plane as circle
    group.add(arrow);

    // Store references for animation
    group.userData.circle = circle;
    group.userData.arrow = arrow;

    return group;
}

export function animateMe(scene, state, time) {
    // Find our group
    const group = scene.children.find(obj => obj.userData.circle);

    if (!group) return;

    const arrow = group.userData.arrow;

    // Compute phase angle
    const ang = phase(time, state.phaseSpeed);

    // Update arrow direction
    const x = Math.cos(ang);
    const y = Math.sin(ang);

    arrow.setDirection(new THREE.Vector3(x, y, 0).normalize());
}
