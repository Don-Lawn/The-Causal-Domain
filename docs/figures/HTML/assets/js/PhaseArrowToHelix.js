// ------------------------------------------------------------
//  PhaseArrowToHelix.js
//  RR demo: rotating phase arrow + forward translation → helix
//  Uses RR-Core objects: makePhaseDisk, makeArrow, rrTrailClone
// ------------------------------------------------------------

import {
    makePhaseDisk,
    makeArrow,
    rrTrailClone,
    rrSetObjectColor
} from './rr-core.js';

import * as THREE from "https://unpkg.com/three@0.164.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";

// ------------------------------------------------------------
// Scene setup
// ------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(3, 3, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// Attach canvas to wrapper instead of body
const wrapper = document.getElementById('canvasWrapper');
wrapper.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.mouseButtons.RIGHT = null;
renderer.domElement.addEventListener('contextmenu', event => {
    event.stopImmediatePropagation();   // stops ALL handlers, including OrbitControls
});
// ------------------------------------------------------------
// RR-Core objects
// ------------------------------------------------------------
const phaseCircle = makePhaseDisk();
scene.add(phaseCircle);

const phaseArrow = makeArrow();
scene.add(phaseArrow);

// ------------------------------------------------------------
// Q-axis (into the screen)
// ------------------------------------------------------------
const qAxisGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -2)
]);
const qAxisMat = new THREE.LineBasicMaterial({ color: 0x00ffff });
const qAxis = new THREE.Line(qAxisGeom, qAxisMat);
scene.add(qAxis);

// ------------------------------------------------------------
// Helix parameters
// ------------------------------------------------------------
const ROTATIONS = 20;          // number of turns
const OMEGA = 2 * Math.PI;     // 1 rotation per second
const SPEED = 1;             // forward speed along +Z

let t0 = performance.now();


function setObjectColour( ) {

}

// ------------------------------------------------------------
// Animation loop
// ------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const t = (performance.now() - t0) * 0.001;  // seconds
    const angle = OMEGA * t;

    // 1. Rotate arrow in phase plane (XY)
    phaseArrow.rotation.z = angle;// Normalize angle to [0, 2π)

    //set Phase Arrow colour according to normalised phase
        const a = (angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

        // Quadrants: red, green, red, green
        const isGreen =
            (a < Math.PI / 2) ||
            (a > Math.PI && a < 3 * Math.PI / 2);


        // Apply color
        const color = isGreen ? 0x00ff00 : 0xff0000;

        // Apply to entire arrow
        rrSetObjectColor(phaseArrow, color);


    // 2. Translate arrow along Q-axis (+Z direction)
    phaseArrow.position.z = SPEED * t;

    // 3. Leave trail only for the first 50 rotations
    if (angle < ROTATIONS * 2 * Math.PI) {
        rrTrailClone(phaseArrow, scene, {
            opacity: 0.25,
            scale: 1.0
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

// ------------------------------------------------------------
// Resize handling
// ------------------------------------------------------------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ------------------------------------------------------------
// Start animation
// ------------------------------------------------------------
animate();
