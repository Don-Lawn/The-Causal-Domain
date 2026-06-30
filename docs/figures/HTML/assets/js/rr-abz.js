// rr-abz.js
// Hybrid domain: twin-slit interference billboard + helix mapping
import * as THREE from 'three';

import {
    RRPalette,
    RRLayout,
    makeBillboard,
    makeTwinSlitTexture,
    phase
} from './rr-core.js';

export function initState() {
    return {
        helixRadius: 0.8,
        helixPitch: 0.4,
        helixTurns: 2.0,
        phaseSpeed: 1.0
    };
}

export function build(scene) {

    const group = new THREE.Group();
    group.position.set(
        RRLayout.abzPos.x,
        RRLayout.abzPos.y,
        RRLayout.abzPos.z
    );    
    scene.add(group);


    // ===== BILLBOARD PANEL =====
    const twinTex = makeTwinSlitTexture(RRPalette.hybrid);

    const panel = makeBillboard({
        texture: twinTex,
        color: RRPalette.hybrid,
        width: RRLayout.panelSize.wBottom,
        height: RRLayout.panelSize.hBottom,
        opacity: 0.12
    });

    panel.position.set(0, 0, -0.01);
    group.add(panel);

    // ===== HELIX GEOMETRY =====
    const helixCurve = makeHelixCurve(
        0.8,   // radius
        0.4,   // pitch
        2.0    // turns
    );

    const helixGeo = new THREE.TubeGeometry(helixCurve, 200, 0.05, 16, false);
    const helixMat = new THREE.MeshBasicMaterial({
        color: RRPalette.hybrid
    });

    const helix = new THREE.Mesh(helixGeo, helixMat);
    group.add(helix);

    // Store references for animation
    group.userData.helix = helix;
    group.userData.helixParams = {
        radius: 0.8,
        pitch: 0.4,
        turns: 2.0
    };

    return group;
}

// ===== HELIX CURVE FACTORY =====
class HelixCurve extends THREE.Curve {
    constructor(radius, pitch, turns) {
        super();
        this.radius = radius;
        this.pitch = pitch;
        this.turns = turns;
    }

    getPoint(t) {
        const ang = t * Math.PI * 2 * this.turns;
        const x = this.radius * Math.cos(ang);
        const y = this.radius * Math.sin(ang);
        const z = -this.pitch * ang;
        return new THREE.Vector3(x, y, z);
    }
}
function makeHelixCurve(radius, pitch, turns) {
    return new HelixCurve(radius, pitch, turns);
}


export function animateMe(scene, state, time) {
    // Find our group
    const group = scene.children.find(obj => obj.userData.helix);
    if (!group) return;

    const helix = group.userData.helix;
    const params = group.userData.helixParams;

    // ===== Animate helix colour =====
    const t = Math.sin(phase(time, state.phaseSpeed));
    const hue = (t + 1) / 2;

    const color = new THREE.Color();
    color.setHSL(hue, 1.0, 0.5);
    helix.material.color.copy(color);

    // ===== Animate helix geometry (phase shift) =====
    const shift = phase(time, state.phaseSpeed) * 0.2;

    const helixCurve = new THREE.Curve();
    helixCurve.getPoint = function (u) {
        const ang = u * Math.PI * 2 * params.turns + shift;
        const x = params.radius * Math.cos(ang);
        const y = params.radius * Math.sin(ang);
        const z = -params.pitch * ang;
        return new THREE.Vector3(x, y, z);
    };

    const newGeo = new THREE.TubeGeometry(helixCurve, 200, 0.05, 16, false);
    helix.geometry.dispose();
    helix.geometry = newGeo;
}
