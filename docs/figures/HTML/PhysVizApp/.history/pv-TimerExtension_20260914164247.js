// ---------------------------------------------------------------------------
// pv-timerExtension.js (updated)
// Timers inherit hints from the object
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import { PVTimer } from "./pv-timer.js";
import EventBusInstance from "./pv-eventBus.js";

export class TimerExtension extends BaseExtension {
    constructor() {
        super("timers");
        this.timers = new Map();
    }

    onAttach(object) {

        if (!object.bus) {
            throw new Error(`TimerExtension requires object '${object.id}' to have a bus.`);
        }

        const bus = object.bus;

        object.startTimer = (durationMs, eventName, perpetual = false) =>
            this._startTimer(object, durationMs, eventName, perpetual);

        object.stopTimer = (timerId) => this._stopTimer(timerId);

        EventBusInstance.on(bus, "TIMER_EXPIRED", (payload) => {
            this._onTimerExpired(object, payload);
        });
    }

    _startTimer(object, durationMs, eventName, perpetual) {
        const timerId = `timer_${object.id}_${Date.now()}`;

        const timer = new PVTimer(
            timerId,
            durationMs,
            eventName,
            object.bus,
            perpetual
        );

        // Inherit hints from the object
        timer.hints = object.hints;

        EventBusInstance.addObjectToBus(object.bus, timer);
        timer.registerForTicks();

        this.timers.set(timerId, timer);
        return timerId;
    }

    _stopTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (timer) {
            timer.destroy();
            this.timers.delete(timerId);
        }
    }

    _onTimerExpired(object, { sourceId }) {
        if (object.fsm) {
            object.fsm._receive("TIMER_EXPIRED", { timerId: sourceId }, {});
        }
    }

    onDetach(object) {
        delete object.startTimer;
        delete object.stopTimer;

        for (const [id, timer] of this.timers) {
            timer.destroy();
        }

        this.timers.clear();
    }
}
