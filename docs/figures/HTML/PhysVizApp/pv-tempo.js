// pv-tempo.js
import { PVFSM } from "./pv-fsm.js";
import EventBus from "./pv-eventBus.js";

export class PVTempo {
    constructor(name, logicalBus, rate = 1.0) {
        this.name = name;
        this.logicalBus = logicalBus;
        this.rate = rate;     // multiplier applied to dt
        this.fsm = new PVFSM(name + "_FSM", logicalBus);

        this._setupFSM();
    }

    _setupFSM() {

        // Tempo lifecycle
        this.fsm.on("INITIALISED", `${this.logicalBus}_LOAD`, () => {
            this.fsm.transition("ACTIVE");
        });

        this.fsm.on("ACTIVE", `${this.logicalBus}_UNLOAD`, () => {
            this.fsm.transition("UNLOADED");
        });

        // Convert MASTER_TICK → UPDATE_TICK on this tempo bus
        this.fsm.on("ACTIVE", "MASTER_TICK", (payload) => {
            const dt = payload.dt * this.rate;

            EventBus.emit("UPDATE_TICK", { dt }, this.logicalBus);
        });
    }
}
