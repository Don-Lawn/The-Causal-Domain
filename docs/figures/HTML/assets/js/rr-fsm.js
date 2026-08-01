// rr-fsm.js
import { EventBus, EventBusInstance } from "./rr-eventbus.js";

export class FSM {
  constructor(definition, actions, guards = {}) {
    this.states = definition.states;
    this.events = definition.events;
    this.transitions = definition.transitions;
    this.actions = actions;
    this.guards = guards;

    this.currentState = this.states[0];

    // Subscribe FSM to all event types
    this.events.forEach(eventName => {
      EventBus.on(eventName, (payload = {}) => this.handle(eventName, payload));
    });
  }

  evaluateGuard(transition, context) {
    if (!transition.guard) {
      return true;
    }

    if (typeof transition.guard === "function") {
      return transition.guard.call(this, context);
    }

    if (typeof transition.guard === "string") {
      if (!this.guards[transition.guard]) {
        console.warn(`FSM: Unknown guard=${transition.guard} for state=${context.fromState}, event=${context.eventName}`);
        return false;
      }

      return this.guards[transition.guard].call(this, context);
    }

    return Boolean(transition.guard);
  }

  handle(eventName, payload = {}) {
    const state = this.currentState;
    const stateTransitions = this.transitions[state];

    if (!stateTransitions || !stateTransitions[eventName]) {
      console.warn(`FSM: No transition for state=${state}, event=${eventName}`);
      return;
    }

    const transition = stateTransitions[eventName];
    const { action, nextState } = transition;
    const context = {
      fsm: this,
      eventName,
      payload,
      fromState: state,
      toState: nextState
    };

    const guardPassed = this.evaluateGuard(transition, context);
    if (!guardPassed) {
      console.warn(`FSM: Guard rejected transition state=${state}, event=${eventName}`);
      return;
    }

    // Run the action
    if (action && this.actions[action]) {
      this.actions[action](context);
    }

    // Change state
    const oldState = this.currentState;
    this.currentState = nextState;

    // Emit state-change event
    // @ts-ignore
    EventBusInstance.emit("STATE_CHANGED", {
      from: oldState,
      to: nextState,
      event: eventName
    });
  }

  update() {
    const state = this.currentState;
    const fn = this.actions[`update_${state}`];
    if (fn) fn();
  }
}
