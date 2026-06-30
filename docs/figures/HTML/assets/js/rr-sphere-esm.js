//document.body.innerHTML += "<div>HELLO FROM RR-sphere-esm.js</div>";

//
// RR Sphere Animation
// Uses rr-core.js
//


import * as THREE from "https://unpkg.com/three@0.164.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";


import {
    setupScene,
    setupCamera,
    setupRenderer,
    addAmbientLight,
    makeSphere,
    makeRing,
    makeArrow,
    makePhaseDisk,
    makeDashedAxis,
    rotatePhaseArrow,
    animateDash
} from "./rr-core.js";



let phase = 0;

// -------------------------------
// Scene Setup
// -------------------------------

const scene = setupScene();
const camera = setupCamera();
const renderer = setupRenderer();

addAmbientLight(scene);


// -------------------------------
// Geometry
// -------------------------------

// Sphere
const sphere = makeSphere();
scene.add(sphere);

// Great circles
scene.add(makeRing(0x00ccff, {x:0, y:0, z:0}));          // XY
scene.add(makeRing(0xff8800, {x:Math.PI/2, y:0, z:0}));  // XZ
scene.add(makeRing(0x00ff88, {x:0, y:Math.PI/2, z:0}));  // YZ

// Phase disk (quadrants)
const phaseDisk = makePhaseDisk();
phaseDisk.rotation.x = Math.PI / 2;   // into XZ plane
scene.add(phaseDisk);

// Phase arrow
const phaseArrow = makeArrow(0xff0000, 1.0);
phaseArrow.rotation.z = Math.PI / 2;
scene.add(phaseArrow);

// Q-axis (blue)
const qAxis = makeArrow(0x0080ff, 1.0);
qAxis.rotation.x = Math.PI;   // flip to −Y
scene.add(qAxis);

// Dashed Z-axis
const zAxis = makeDashedAxis(0x00ffff, 2.8, 0.05, 0.05);
scene.add(zAxis);


// -------------------------------
// Initial tilt
// -------------------------------

scene.rotation.x = 0.4;



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// -------------------------------
// Animation Loop
// -------------------------------

function animate() {
    requestAnimationFrame(animate);

    phase += 0.05;

    rotatePhaseArrow(phaseArrow, phase);
 //   spinScene(scene, 0.001);
    animateDash(zAxis.material, 0.01);
    controls.update();


    renderer.render(scene, camera);
}

animate();

