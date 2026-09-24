// ---------------------------------------------------------------------------
// pv-fsmExtension.js (updated)
// FSM receives merged hints automatically
// ---------------------------------------------------------------------------

import { BaseExtension } from "./pv-baseExtension.js";
import { PVFSM } from "./pv-fsm.js";
import EventBusInstance from "./pv-eventBus.js";

export class FSMExtension extends BaseExtension {

    constructor(fsmName) {
        super("fsm");
        this.fsmName = fsmName;   // store name safely
        this.fsm = null;          // will be created on attach
    }

    onAttach(object) {

        // Create the FSM instance properly
        this.fsm = new PVFSM(object.bus, object.bus);

        // Attach FSM to the object
        object.fsm = this.fsm;

        // Give FSM access to object hints
        this.fsm.hints = object.hints;
    }



    onDetach(object) {
        delete object.fsm;
        delete object.sendToFSM;
        this.fsm = null;
    }
}
