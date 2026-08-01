// fsm/phaseArrow/phaseArrow-fsm.js
// JSON-shaped FSM definition for the PhaseArrow finite-state machine.

export const PhaseArrowFSM = {
  name: "PhaseArrow",
  initialState: "SPINNING",
  states: ["SPINNING", "TRAILING", "PAUSED"],
  events: ["TICK"],
  actions: {
    beginSpin: () => {},
    activateTrail: () => {},
    freezeMotion: () => {}
  },
  guards: {
    canAdvance: () => true,
    canPause: () => true
  },
  transitions: {
    SPINNING: {
      TICK: {
        guard: "canAdvance",
        action: "activateTrail",
        nextState: "TRAILING"
      }
    },
    TRAILING: {
      TICK: {
        guard: "canPause",
        action: "freezeMotion",
        nextState: "PAUSED"
      }
    },
    PAUSED: {
      TICK: {
        action: "freezeMotion",
        nextState: "PAUSED"
      }
    }
  }
};
