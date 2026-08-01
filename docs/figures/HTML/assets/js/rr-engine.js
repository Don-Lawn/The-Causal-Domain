// rr-engine.js
import { FSM } from "./rr-fsm.js";
import { EventBusInstance } from "./rr-eventbus.js";

// @ts-ignore
import { PhaseArrowDefinition } from "../PhysVizApp/rr/phaseArrow/phaseArrow-definition.js";
import { PhaseArrowActions } from "../PhysVizApp/rr/phaseArrow/phaseArrow-actions.js";
import { PhaseArrowGuards } from "../PhysVizApp/rr/phaseArrow/phaseArrow-guards.js";

export const phaseArrowFSM = new FSM(PhaseArrowDefinition, PhaseArrowActions, PhaseArrowGuards);

// Debug listener
EventBus.on("STATE_CHANGED", ({ from, to, event }) => {  
  const msg = `FSM: ${from} → ${to} via ${event}`;
  console.log(msg);

  // Optional: show it on screen
  const el = document.getElementById("fsmState");
  if (el) el.textContent = msg;
});

// Start spinning
EventBusInstance.emit("START");

// After some time, generate the disk
setTimeout(() => {
  EventBusInstance.emit("TIMEOUT");
}, 3000);

function animate() {
    requestAnimationFrame(animate);

    phaseArrowFSM.update();   // FSM drives animation
    renderer.render(scene, camera);
}
