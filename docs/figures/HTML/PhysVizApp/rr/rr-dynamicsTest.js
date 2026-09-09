// rr-dynamicsTest.js

import { PVStateVector } from "../pv-stateVector.js";
import { PVPID } from "../pv-PID.js";
import { PVDynamics } from "../pv-dynamics.js";

// ---------------------------------------------
// 1. Build two objects: phaseEdge and camera
// ---------------------------------------------

const NUM_DOMAINS = 2;      // spatial + angular
const NUM_DERIVATIVES = 3; // D0, D1, D2
const NUM_AXES = 3;         // x,y,z

const phaseEdge = new PVStateVector(NUM_DOMAINS, NUM_DERIVATIVES, NUM_AXES);
const camera    = new PVStateVector(NUM_DOMAINS, NUM_DERIVATIVES, NUM_AXES);

// ---------------------------------------------
// 2. Build a path of 10 random StateVectors
// ---------------------------------------------

function randomSV() {
    const sv = new PVStateVector(NUM_DOMAINS, NUM_DERIVATIVES, NUM_AXES);
    for (let d = 0; d < NUM_DOMAINS; d++)
        for (let n = 0; n < NUM_DERIVATIVES; n++)
            for (let a = 0; a < NUM_AXES; a++)
                sv.set(d, n, a, Math.random());
    return sv;
}

const path = Array.from({ length: 10 }, () => randomSV());

// ---------------------------------------------
// 3. PID for camera motion
// ---------------------------------------------

const moveCamPID = new PVPID(NUM_DOMAINS, NUM_DERIVATIVES, NUM_AXES);
const tuneCamPID = new PVPID(NUM_DOMAINS, NUM_DERIVATIVES, NUM_AXES);

// ---------------------------------------------
// 4. Loop through 9 pairs of SVs
// ---------------------------------------------

const dt = 0.016;      // 60 FPS microsegment
const segmentTime = 3; // 3 seconds per transition

for (let i = 0; i < path.length - 1; i++) {

    const startSV = path[i];
    const endSV   = path[i + 1];

    console.log(`\n=== Transition ${i} → ${i+1} ===`);

    // -----------------------------------------
    // 5. Calculate difference of pair
    // -----------------------------------------

    const delta = PVStateVector.delta(endSV, startSV);
    console.log("Delta:", delta.data);

    // -----------------------------------------
    // 6. Feed delta into moveCamPID
    // -----------------------------------------

    const steps = Math.floor(segmentTime / dt);

    for (let step = 0; step < steps; step++) {

        // Compute camera error relative to target
        const camDelta = PVStateVector.delta(endSV, camera);

        // PID correction
        const correction = moveCamPID.update(camDelta, dt);

        // Apply correction to camera
        camera.add(correction);

        // -------------------------------------
        // 7. Generate hints for camera
        // -------------------------------------

        const hints = camera.generateHints();
        console.log("Hints:", hints);

        // -------------------------------------
        // 8. Feed rates into tuneCamPID
        // -------------------------------------

        tuneCamPID.update(correction, dt);

        // -------------------------------------
        // 9. Next microsegment
        // -------------------------------------
    }
}

console.log("\nFinal camera state:", camera.data);
