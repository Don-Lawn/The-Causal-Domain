import EventBusInstance, * as EventBus from "./pv-eventBus.js";

export class PVTimer {
    constructor(id, durationMs, busName, perpetual = false) {
        this.id = id;
        this.duration = durationMs;
        this.remaining = durationMs;
        this.busName = busName;
        this.perpetual = perpetual;
    }

    registerForTicks() {
        EventBusInstance.on("MASTER", "TICK", this._onTick);
    }

    _onTick = (dt) => {
        this.remaining -= dt;

        if (this.remaining <= 0) {

            // Emit standard timer event
            EventBusInstance.emit(this.busName, "TIMER_EXPIRED", { sourceId: this.id });

            if (this.perpetual) {
                this.remaining = this.duration;
            } else {
                EventBusInstance.emit(this.busName, "OBJECT_DESTROY", { id: this.id });
            }
        }
    }
}


        