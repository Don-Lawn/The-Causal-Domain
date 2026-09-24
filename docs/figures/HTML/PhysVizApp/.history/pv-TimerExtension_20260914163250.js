// ---------------------------------------------------------------------------
// TimerExtension.js
// Provides timer capability to any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./BaseExtension.js";
import { PVTimer } from "./pv-timer.js";
import EventBusInstance from "./pv-eventBus.js";

export class TimerExtension extends BaseExtension {
    constructor() {
        super("timers");
        this.timers = new Map();
    }

    onAttach(object) {

        // Safety: require a bus capability
        if (!object.bus) {
            throw new Error(
                `TimerExtension requires object '${object.id}' to have a bus. ` +
                `Attach BusExtension first.`
            );
        }

        const bus = object.bus;

        // Glue: expose timer creation on the object
        object.startTimer = (durationMs, eventName, perpetual = false) =>
            this._startTimer(object, durationMs, eventName, perpetual);

        // Glue: expose timer destruction
        object.stopTimer = (timerId) => this._stopTimer(timerId);

        // Subscribe to timer events
        EventBusInstance.on(bus, "TIMER_EXPIRED", (payload) => {
            this._onTimerExpired(object, payload);
        });

        EventBusInstance.on(bus, "OBJECT_DESTROY", ({ id }) => {
            if (this.timers.has(id)) {
                this._onTimerDestroyed(id);
            }
        });
    }

    // -----------------------------------------------------------------------
    // Internal: create a timer
    // -----------------------------------------------------------------------
    _startTimer(object, durationMs, eventName, perpetual) {
        const timerId = `timer_${object.id}_${Date.now()}`;

        const timer = new PVTimer(
            timerId,
            durationMs,
            eventName,
            object.bus,
            perpetual
        );

        // Attach timer to bus
        EventBusInstance.addObjectToBus(object.bus, timer);

        // Register timer for ticks
        timer.registerForTicks();

        // Track timer
        this.timers.set(timerId, timer);

        return timerId;
    }

    // -----------------------------------------------------------------------
    // Internal: stop a timer
    // -----------------------------------------------------------------------
    _stopTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (timer) {
            timer.destroy();
            this.timers.delete(timerId);
        }
    }

    // -----------------------------------------------------------------------
    // Timer expired → forward to FSM if present
    // -----------------------------------------------------------------------
    _onTimerExpired(object, { sourceId }) {
        const timerId = sourceId;

        // Forward to FSM if present
        if (object.fsm) {
            object.fsm._receive("TIMER_EXPIRED", { timerId }, {});
        }
    }

    // -----------------------------------------------------------------------
    // Timer destroyed
    // -----------------------------------------------------------------------
    _onTimerDestroyed(timerId) {
        this.timers.delete(timerId);
    }

    // -----------------------------------------------------------------------
    // Detach capability
    // -----------------------------------------------------------------------
    onDetach(object) {
        // Remove glue
        delete object.startTimer;
        delete object.stopTimer;

        // Destroy all timers
        for (const [id, timer] of this.timers) {
            timer.destroy();
        }

        this.timers.clear();
    }
}
