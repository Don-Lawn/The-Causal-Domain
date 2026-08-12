// ---------------------------------------------------------------------------
// ActiveEntity.js
// Base class for any object that participates in RR's event-driven architecture.
// ---------------------------------------------------------------------------

import EventBusInstance  from "./pv-eventBus.js";
import { PVFSM } from "./pv-fsm.js";

export class ActiveEntity {

    /**
     * @param {string} localBus   The bus this entity listens on (e.g. "ABC", "MASTER").
     * @param {string|null} parentBus  The bus above this one in the hierarchy.
     * @param {PVFSM|null} fsm      Optional FSM instance; if omitted, a new one is created.
     */
    constructor(localBus, parentBus = null, fsm = null) {
        this.bus = localBus;
        this.parentBus = parentBus;
        this.fsm = fsm || new PVFSM(localBus, localBus);

        // NEW: register this bus in the EventBus hierarchy
        EventBusInstance.createBus(localBus, parentBus);

        this._registerLifecycleEvents();
        this._registerTickEvents();
        this._registerRenderEvents();

     }


 


    // -----------------------------------------------------------------------
    // Local bus → FSM event handling
    // -----------------------------------------------------------------------
    // ACTIVEENTITY._REGISTERLIFECYCLEEVENTS.
    // This routine registers handlers to deliver events to the associated FSM.
    _registerLifecycleEvents() {
        EventBusInstance.on(this.bus, "LOAD", (p, evt) => this.fsm._receive("LOAD", p, evt));
        EventBusInstance.on(this.bus, "START", (p, evt) => this.fsm._receive("START", p, evt));
        EventBusInstance.on(this.bus, "PAUSE", (p, evt) => this.fsm._receive("PAUSE", p, evt));
        EventBusInstance.on(this.bus, "RESUME", (p, evt) => this.fsm._receive("RESUME", p, evt));
        EventBusInstance.on(this.bus, "STOP", (p, evt) => this.fsm._receive("STOP", p, evt));
    }

    _registerTickEvents() {
        EventBusInstance.on(this.bus, "TICK", (p, evt) => this.fsm._receive("TICK", p, evt));
    }

    _registerRenderEvents() {
        EventBusInstance.on(this.bus, "RENDER", (p, evt) => this.fsm._receive("RENDER", p, evt));
    }

    // -----------------------------------------------------------------------
    // Default FSM lifecycle wiring
    // Subclasses call configureDefaultLifecycle() after defining states.
    // -----------------------------------------------------------------------

    configureDefaultLifecycle() {

        this.fsm.on("UNINITIALISED", "LOAD", () => {
            this.fsm.transition("READY");
        });

        this.fsm.on("READY", "START", () => {
            this.fsm.transition("ACTIVE");
        });

        this.fsm.on("ACTIVE", "PAUSE", () => {
            this.fsm.transition("PAUSED");
        });

        this.fsm.on("PAUSED", "RESUME", () => {
            this.fsm.transition("ACTIVE");
        });

        this.fsm.on("*", "STOP", () => {
            this.fsm.transition("STOPPED");
        });

        // ACTIVE entities update; PAUSED entities can still render for controls/interactivity.
        this.fsm.on("ACTIVE", "TICK", ({ dt }) => this.update(dt));
        this.fsm.on("ACTIVE", "RENDER", ({ dt }) => this.render(dt));
        this.fsm.on("PAUSED", "RENDER", ({ dt }) => this.render(dt));
    }

    // -----------------------------------------------------------------------
    // Hooks for subclasses
    // -----------------------------------------------------------------------

    update(dt) {
        // Subclasses override
    }

    render(dt) {
        // Subclasses override
    }
}
