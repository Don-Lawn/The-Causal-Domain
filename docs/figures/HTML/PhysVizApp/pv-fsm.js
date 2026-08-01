// pv-FSM.js
import EventBusInstance from "./pv-eventBus.js";

/**
 * Generic event-driven FSM
 */
export class PVFSM {
    constructor(name, logicalBus, definition = null) {
        this.name = name;
        this.logicalBus = logicalBus;
        this.state = "UNINITIALISED";
        this.handlers = {};   // state → { eventName → fn }
        this.definition = null;
        this.actionMap = {};
        this.guardMap = {};

        if (definition) {
            this.configureFromDefinition(definition);
        }
    }

    /**
     * Register a handler for a given state + eventName
     */
    // PVFSM  registration of STATE/EVENT HANDLERS
    // Note that this routine registers a state/event handler for itself, 
    // and a handler for the bus to deliver the event here.
    on(state, eventName, fn) {
        if (!this.handlers[state]) {
            this.handlers[state] = {};
        }
        if (!this.handlers[state][eventName]) {
            this.handlers[state][eventName] = [];
        }
        this.handlers[state][eventName].push(fn);
    }

    /**
     * Configure the machine from a JSON-like definition.
     * The definition is expected to be a plain object with:
     *   - name
     *   - initialState
     *   - states
     *   - events
     *   - actions
     *   - guards
     *   - transitions
     */
    configureFromDefinition(definition, runtimeActions = {}, runtimeGuards = {}) {
        if (!definition || typeof definition !== "object") {
            return this;
        }

        this.definition = definition;
        this.state = definition.initialState || this.state;

        const definitionActions = Object.entries(definition.actions || {}).reduce((acc, [name, fn]) => {
            if (typeof fn === "function") {
                acc[name] = fn;
            }
            return acc;
        }, {});

        const definitionGuards = Object.entries(definition.guards || {}).reduce((acc, [name, fn]) => {
            if (typeof fn === "function") {
                acc[name] = fn;
            }
            return acc;
        }, {});

        this.actionMap = { ...definitionActions, ...runtimeActions };
        this.guardMap = { ...definitionGuards, ...runtimeGuards };

        const transitions = definition.transitions || {};

        for (const [fromState, eventMap] of Object.entries(transitions)) {
            for (const [eventName, rule] of Object.entries(eventMap || {})) {
                if (!rule || typeof rule !== "object") {
                    continue;
                }

                this.on(fromState, eventName, (payload, evt) => {
                    const context = {
                        fsm: this.name,
                        fromState,
                        eventName,
                        payload,
                        evt,
                        logicalBus: this.logicalBus,
                    };

                    const guardName = rule.guard;
                    if (guardName) {
                        const guardFn = this.guardMap[guardName];
                        if (typeof guardFn === "function" && guardFn(context) === false) {
                            return;
                        }
                    }

                    const actionName = rule.action;
                    if (actionName) {
                        const actionFn = this.actionMap[actionName];
                        if (typeof actionFn === "function") {
                            actionFn.call(this, context, payload, evt);
                        }
                    }

                    if (rule.nextState) {
                        this.transition(rule.nextState);
                    }
                });
            }
        }

        return this;
    }

    /**
     * Internal event receiver
     */
     _receive(eventName, payload, evt) {
        const stateHandlers = this.handlers[this.state];

        if (!stateHandlers) {
            EventBusInstance.emit("EVENT_UNHANDLED", {
                fsm: this.name,
                state: this.state,
                event: eventName,
                reason: "No handlers registered for this state"
            }, this.logicalBus), this.name, "PVFSM._receive";
            return;
        }
        
        const fns = stateHandlers[eventName];

        if (!fns || fns.length === 0) {
            EventBusInstance.emit("EVENT_UNHANDLED", {
                fsm: this.name,
                state: this.state,
                event: eventName,
                reason: "No handler for this event in current state"
            }, this.logicalBus, "PVFSM._receive");
            return;
        }

        // Execute ALL handlers for this state/event
        for (const fn of fns) {
            fn.call(this, payload, evt);
        }
    }


    /**
     * Transition to a new state
     */
    transition(newState) {
        const oldState = this.state;
        this.state = newState;

        EventBusInstance.emit("FSM_STATE_CHANGE", {
            fsm: this.name,
            from: oldState,
            to: newState
          }, 
          this.logicalBus, "PVFSM._transition"); // does not need to be handled.
          
    }

    /**
     * Lifecycle helpers
     */
    init() {
        this.transition("INITIALISED");
    }

    load() {
        this.transition("LOADED");
    }

    unload() {
        this.transition("UNLOADED");
    }

    saveState() {
        return { state: this.state };
    }

    restoreState(saved) {
        this.state = saved.state;
    }
}
