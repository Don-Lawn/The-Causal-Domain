// ---------------------------------------------------------------------------
// ActiveEntity.js
// Base class for any object that participates in RR's event-driven architecture.
// ---------------------------------------------------------------------------

import EventBusInstance from "./pv-eventBus.js";
import { PVFSM } from "./pv-fsm.js";
import { PVTimer } from "./pv-timer.js";

/**
 * @typedef {Object} HintShape
 * @property {string} id
 * @property {string} title
 * @property {string} summary
 * @property {string} detail
 * @property {string} category
 * @property {Object<string, any>=} data
 */

export class ActiveEntity {

    constructor(localBus, parentBus = null, fsm = null, hints = []) {
        this.bus = localBus;
        this.parentBus = parentBus;
        this.fsm = fsm || new PVFSM(localBus, localBus);

        /** @type {HintShape[]} */
        this.hints = hints;

        /** @type {Map<string, PVTimer>} */
        this.timers = new Map();

        // Create the bus hierarchy
        EventBusInstance.createBus(localBus, parentBus);

        // Register lifecycle → FSM
        this._registerLifecycleEvents();
        this._registerTickEvents();
        this._registerRenderEvents();

        // Register timer lifecycle
        this._registerTimerEvents();
    }

    // -----------------------------------------------------------------------
    // Unified emit — all events carry this entity's hints
    // -----------------------------------------------------------------------
    emit(eventName, payload = {}) {
        EventBusInstance.emit(eventName, payload, this.bus, this.bus, this.hints);
    }

    // -----------------------------------------------------------------------
    // Timer API — exposed to FSM and subclasses
    // -----------------------------------------------------------------------
    startTimer(durationMs, eventName, perpetual = false) {
        const timerId = `timer_${this.bus}_${Date.now()}`;

        const timer = new PVTimer(
            timerId,
            durationMs,
            eventName,
            this.bus,
            perpetual
        );

        // Attach timer to same bus/container
        EventBusInstance.addObjectToBus(this.bus, timer);

        // Register timer for ticks
        timer.registerForTicks();

        // Track timer locally
        this.timers.set(timerId, timer);

        return timerId;
    }

    _onTimerExpired({ sourceId }) {
        // Subclasses or FSMs may override or listen for this
        // Default: forward to FSM
        this.fsm._receive("TIMER_EXPIRED", { timerId: sourceId }, {});
    }

    _onTimerDestroyed(timerId) {
        this.timers.delete(timerId);
    }

    _registerTimerEvents() {
        // Timer expired
        EventBusInstance.on(this.bus, "TIMER_EXPIRED", (payload) => {
            this._onTimerExpired(payload);
        });

        // Timer destroyed
        EventBusInstance.on(this.bus, "OBJECT_DESTROY", ({ id }) => {
            if (this.timers.has(id)) {
                this._onTimerDestroyed(id);
            }
        });
    }

    // -----------------------------------------------------------------------
    // Local bus → FSM event handling
    // -----------------------------------------------------------------------
    _registerLifecycleEvents() {
        EventBusInstance.on(this.bus, "LOAD", (p, evt) => {
            this.fsm._receive("LOAD", p, evt);
        });

        EventBusInstance.on(this.bus, "START", (p, evt) => {
            this.fsm._receive("START", p, evt);
        });

        EventBusInstance.on(this.bus, "PAUSE", (p, evt) => {
            this.fsm._receive("PAUSE", p, evt);
        });

        EventBusInstance.on(this.bus, "RESUME", (p, evt) => {
            this.fsm._receive("RESUME", p, evt);
        });

        EventBusInstance.on(this.bus, "STOP", (p, evt) => {
            this.fsm._receive("STOP", p, evt);
        });
    }

    _registerTickEvents() {
        EventBusInstance.on(this.bus, "TICK", (p, evt) => {
            this.fsm._receive("TICK", p, evt);
        });
    }

    _registerRenderEvents() {
        EventBusInstance.on(this.bus, "RENDER", (p, evt) => {
            this.fsm._receive("RENDER", p, evt);
        });
    }

    // -----------------------------------------------------------------------
    // Default FSM lifecycle wiring
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

        this.fsm.on("ACTIVE", "TICK", ({ dt }) => this.update(dt));
        this.fsm.on("ACTIVE", "RENDER", ({ dt }) => this.render(dt));
        this.fsm.on("PAUSED", "RENDER", ({ dt }) => this.render(dt));
    }

    update(dt) {}
    render(dt) {}
}
