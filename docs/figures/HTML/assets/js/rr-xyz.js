// rr-xyz.js
// Phenomenal domain: grid billboard + photon point + z-motion + colour oscillation
import * as THREE from 'three';

import {
    RRPalette,
    RRLayout,
    makeBillboard,
    makeGridTexture,
    phase
} from './rr-core.js';

export function initState() {
    return {
        speed: 1.0,        // photon forward speed
        colorSpeed: 2.0    // oscillation speed
    };
}

export function build(scene) {

    const group = new THREE.Group();
    group.position.set(
        RRLayout.xyzPos.x,
        RRLayout.xyzPos.y,
        RRLayout.xyzPos.z
    );
    scene.add(group);

    // ===== BILLBOARD PANEL =====
    const gridTex = makeGridTexture(RRPalette.phenomenal);

    const panel = makeBillboard({
        texture: gridTex,
        color: RRPalette.phenomenal,
        width: RRLayout.panelSize.wTop,
        height: RRLayout.panelSize.hTop,
        opacity: 0.12
    });

    panel.position.set(0, 0, -0.01);
    group.add(panel);

    // ===== PHOTON POINT =====
    const photonGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const photonMat = new THREE.MeshBasicMaterial({
        color: RRPalette.phenomenal
    });
    const photon = new THREE.Mesh(photonGeo, photonMat);

    photon.position.set(0, 0, 0);
    group.add(photon);

    // Store reference for animation
    group.userData.photon = photon;

    return group;
}

export function animateMe(scene, state, time) {
    // Find our group
    const group = scene.children.find(obj => obj.userData.photon);
    if (!group) return;

    const photon = group.userData.photon;

    // ===== Z-MOTION =====
    const z = phase(time, state.speed);
    photon.position.z = -(z % 2.0 - 1.0); // wrap motion into [-1,1]

    // ===== COLOUR OSCILLATION =====
    const t = Math.sin(phase(time, state.colorSpeed));
    const hue = (t + 1) / 2; // map [-1,1] → [0,1]

    // Convert hue to HSL color
    const color = new THREE.Color();
    color.setHSL(hue, 1.0, 0.5);

    photon.material.color.copy(color);
}
