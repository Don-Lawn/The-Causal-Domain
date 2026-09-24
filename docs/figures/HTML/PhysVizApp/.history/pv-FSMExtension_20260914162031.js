// ---------------------------------------------------------------------------
// FSMExtension.js
// Provides an FSM capability to any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./BaseExtension.js";
import { PVFSM } from "./pv-fsm.js";
import EventBusInstance from "./pv-eventBus.js";

export class FSMExtension extends BaseExtension {
    constructor(fsm = null, busName = null) {
        super("fsm");

        // Optional external FSM (aggregation)
        // or null → create one (composition)
        this.fsm = fsm;

        // Optional override for bus name
        this.busName = busName;
    }

    onAttach(object) {
        // Determine bus name
        const bus = this.busName || object.bus;

        // Create FSM if not provided
        if (!this.fsm) {
            this.fsm = new PVFSM(bus, bus);
        }

        // Glue: expose FSM on the object
        object.fsm = this.fsm;

        // Glue: allow object to send events directly to FSM
        object.sendToFSM = (eventName, payload = {}) => {
            this.fsm._receive(eventName, payload, { sourceBus: bus });
        };

        // Subscribe FSM to all events on the bus
        EventBusInstance.on(bus, "*", (payload, evt) => {
            this.fsm._receive(evt.name, payload, evt);
        });

        // Optional: attach unified hints to FSM context
        this.fsm.hints = object.hints;
    }

    onDetach(object) {
        // Remove glue
        delete object.fsm;
        delete object.sendToFSM;

        // Remove capability reference
        this.fsm = null;
    }
}
