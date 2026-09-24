export const State = Object.freeze({
    RUNNING: "RUNNING",
    PAUSED: "PAUSED",
    STOPPED: "STOPPED"
});

export let currentState = State.RUNNING;

export function setState(nextState) {
    currentState = nextState;
    return currentState;
}

export default { State, currentState, setState };
