// fsm/phaseArrow/phaseArrow-fsm.js
// JSON-shaped FSM definition for the PhaseArrow finite-state machine.

export const PhaseArrowFSM = {
  name: "PhaseArrow",
  initialStage: "STAGE1",
  stages: ["STAGE1", "STAGE2", "STAGE3"],
  events: ["TICK", "NEXTSTAGE"],
  actions: {
    beginSpin: () => {},
    activateTrail: () => {},
    freezeMotion: () => {}
  },
  guards: {
    canAdvance: () => true,
    canPause: () => true
  },
  triggers: [
    {
      state: "STAGE1",
      field: "phase",
      operator: ">=",
      value: 2 * Math.PI,
      emit: "NEXTSTAGE",
      action: "activateTrail",
      nextState: "STAGE2"
    },
    {
      state: "STAGE2",
      field: "phase",
      operator: ">=",
      value: 4 * Math.PI,
      emit: "NEXTSTAGE",
      action: "startCameraLift",
      nextState: "STAGE3"
    },
    {
      state: "STAGE3",
      field: "phase",
      operator: ">=",
      value: 22 * Math.PI,
      emit: "NEXTSTAGE",
      action: "freezeMotion",
      nextState: "PAUSED"
    }
  ],
  transitions: {
    STAGE1: {
      TICK: {
        guard: "canAdvance",
        action: "activateTrail",
        nextState: "STAGE2"
      }
    },
    STAGE2: {
      TICK: {
        guard: "canPause",
        action: "freezeMotion",
        nextState: "STAGE3"
      }
    },
    STAGE3: {}
  }
};
