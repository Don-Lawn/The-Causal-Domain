// ---------------------------------------------------------------------------
// pv-fsmExtension.js (updated)
// FSM receives merged hints automatically
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import { PVFSM } from "./pv-fsm.js";
import EventBusInstance from "./pv-eventBus.js";

export class FSMExtension extends BaseExtension {
    constructor(fsm = null) {
        super("fsm");
        this.fsm = fsm;
    }

    onAttach(object) {

        if (!object.bus) {
            throw new Error(`FSMExtension requires object '${object.id}' to have a bus.`);
        }

        const bus = object.bus;

        if (!this.fsm) {
            this.fsm = new PVFSM(bus, bus);
        }

        // Glue
        object.fsm = this.fsm;

        // FSM sees merged hints
        this.fsm.hints = object.hints;

        // Direct send
        object.sendToFSM = (eventName, payload = {}) => {
            this.fsm._receive(eventName, payload, { sourceBus: bus });
        };

        // Subscribe FSM to all bus events
        EventBusInstance.on(bus, "*", (payload, evt) => {
            this.fsm._receive(evt.name, payload, evt);
        });
    }

    onDetach(object) {
        delete object.fsm;
        delete object.sendToFSM;
        this.fsm = null;
    }
}
