// ---------------------------------------------------------------------------
// FSMExtension.js
// Provides an FSM capability to any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
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

    onAttach(host) {
        // Determine bus name
        const bus = this.busName || object.bus;

        // Create FSM if not provided
        if (!this.fsm) {
            this.fsm = new PVFSM(bus, bus);
        }

        // Glue: expose FSM on the object
        host.fsm = this.fsm;

        // Glue: allow object to send events directly to FSM
        host.sendToFSM = (eventName, payload = {}) => {
            this.fsm._receive(eventName, payload, { sourceBus: bus });
        };

        // Subscribe FSM to all events on the bus
        EventBusInstance.on(bus, "*", (payload, evt) => {
            this.fsm._receive(evt);
        });

        // Optional: attach unified hints to FSM context
        this.fsm.hints = host.hints;
    }

    onDetach(host) {
        // Remove glue
        delete host.fsm;
        delete host.sendToFSM;

        // Remove capability reference
        this.fsm = null;
    }
}
