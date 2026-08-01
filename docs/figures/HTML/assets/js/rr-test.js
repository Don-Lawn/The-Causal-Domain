// @ts-check
// ============================================================
// test.js — RR Orchestrator (semantic + renderer separation)
// ============================================================

import { Pearl } from './rr-pearl.js';
import { Domain } from './rr-domain.js';
import { RRPhaseArrow } from "./rr-phaseArrow.js";
import { FSM } from "./rr-fsm.js";
import { PhaseArrowDefinition } from "../PhysVizApp/rr/phaseArrow/phaseArrow-definition.js";
import { PhaseArrowActions } from "../PhysVizApp/rr/phaseArrow/phaseArrow-actions.js";
import { PhaseArrowGuards } from "../PhysVizApp/rr/phaseArrow/phaseArrow-guards.js";

const phaseArrowFSM = new FSM(PhaseArrowDefinition, PhaseArrowActions, PhaseArrowGuards);


// ------------------------------------------------------------
// 1. Locate the shared canvas
// ------------------------------------------------------------
const canvas = /** @type {HTMLCanvasElement} */ (
    document.getElementById("rrCanvas")
);

function resizeCanvasToDisplaySize(canvas) {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

resizeCanvasToDisplaySize(canvas);

// ------------------------------------------------------------
// 2. Create the Pearl singleton (renderer)
// ------------------------------------------------------------
export const pearl = new Pearl(canvas);

// Pearl renderer size must match canvas size
pearl.renderer.setSize(canvas.width, canvas.height);

// ------------------------------------------------------------
// 3. Locate domain panels in the HTML
// ------------------------------------------------------------
/** @type {HTMLElement[]} */
const panelElems = [
    document.getElementById("abcPanel"),
    document.getElementById("xyzPanel"),
    document.getElementById("abzPanel")
].filter((el) => el instanceof HTMLElement);

// ------------------------------------------------------------
// 4. Create Domain instances
// ------------------------------------------------------------
/** @type {Domain[]} */
const domains = panelElems.map(panel => new Domain(canvas, panel, pearl));

// ------------------------------------------------------------
// 5. Populate domains with semantic objects
// ------------------------------------------------------------
const abcDomain = domains[0];

// Create semantic PhaseArrow (semantic object)
const arrow = new RRPhaseArrow(pearl, {
    color: 0xff0000,
    shaftLength: 1.4,
    headLength: 0.3,
    angularVelocity: 1.5
});

// Add semantic object to domain (inserts RRHandle into payload)
abcDomain.addObject(arrow);
arrow.trailEnabled = true;
arrow.fadeRate = -0.001;


// Position the arrow via its RRHandle
pearl.setPosition(arrow.handle, { x: 0, y: 0, z: 0 });

// ------------------------------------------------------------
// 6. Animation loop
// ------------------------------------------------------------
function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();

    phaseArrowFSM.update();

    abcDomain.update(dt);
    xyzDomain.update(dt);
    abzDomain.update(dt);

    abcDomain.render(pearl);
    xyzDomain.render(pearl);
    abzDomain.render(pearl);

    renderer.render(scene, camera);
}

animate();

// ------------------------------------------------------------
// 7. Resize handling
// ------------------------------------------------------------
window.addEventListener("resize", () => {
    resizeCanvasToDisplaySize(canvas);
    pearl.renderer.setSize(canvas.width, canvas.height);

    // Update each domain's rect
    domains.forEach(domain => domain.render());
});
