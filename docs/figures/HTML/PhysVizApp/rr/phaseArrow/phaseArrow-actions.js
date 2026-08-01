// fsm/phaseArrow/phaseArrow-actions.js

export const PhaseArrowActions = {
  beginSpin(context) {
    console.log("RR: Begin spinning phase vector");
    // Start rotation tween, set angular velocity, etc.
    // Example:
    // phaseVector.startSpin();
    console.log("FSM context:", context);
  },

  generateDisk(context) {
    console.log("RR: Generate phase disk from sweep");
    // Build disk geometry from trail
    // Example:
    // phaseDisk.buildFromTrail();
    console.log("FSM context:", context);
  }
};
