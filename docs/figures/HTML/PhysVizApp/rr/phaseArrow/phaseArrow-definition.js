// fsm/phaseArrow/phaseArrow-definition.js

export const PhaseArrowDefinition = {
  name: "PhaseArrow",
  initialState: "SPINNING",
  states: ["SPINNING", "TRAILING", "PAUSED"],
  events: ["TICK"],

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
