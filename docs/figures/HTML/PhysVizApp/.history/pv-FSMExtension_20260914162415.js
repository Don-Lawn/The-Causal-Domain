// ---------------------------------------------------------------------------
// FSMExtension.js
// Provides an FSM capability to any BaseObject
// ---------------------------------------------------------------------------

import { BaseExtension } from "./BaseExtension.js";
import { PVFSM } from "./pv-fsm.js";
import EventBusInstance from "./pv-eventBus.js";

export class FSMExtension extends BaseExtension {
    constructor(fsm = null) {
        super("fsm");

        // Optional external FSM (aggregation)
        // If null → create one (composition)
        this.fsm = fsm;
    }

    onAttach(object) {

        // Safety: require a bus capability
        if (!object.bus) {
            throw new Error(
                `FSMExtension requires object '${object.id}' to have a bus. ` +
                `Attach BusExtension first.`
            );
        }

        const bus = object.bus;

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

        // Unified hints available inside FSM
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
