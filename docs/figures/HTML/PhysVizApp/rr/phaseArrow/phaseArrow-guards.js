// fsm/phaseArrow/phaseArrow-guards.js

export const PhaseArrowGuards = {
  canRestartSpin(context) {
    return context.fromState !== "Spinning" || context.eventName === "START";
  },

  canGenerateDisk(context) {
    return context.fromState === "Spinning";
  }
};
