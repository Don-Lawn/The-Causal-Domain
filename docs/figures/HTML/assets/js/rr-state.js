export const State = {
    RUNNING: "RUNNING",
    PAUSED: "PAUSED"
};

export var currentState = State.RUNNING;
export function setState(newState) {
    currentState = newState;
}
