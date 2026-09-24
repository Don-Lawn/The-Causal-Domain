// pv-master.js
import { BaseObject } from "./pv-baseObject.js";
import { BusExtension } from "./pv-BusExtension.js";
import { HintExtension } from "./pv-HintExtension.js";
import { FSMExtension } from "./pv-FSMExtension.js";


export function MasterFSM() {

    // Create MASTER identity object
    const master = new BaseObject("MASTER");

    // MASTER has a bus but no parent
    master.extend(new BusExtension("MASTER", null));

    // MASTER can have hints (optional but useful)
    master.extend(new HintExtension());

    // Attach the FSM to MASTER
    master.extend(new FSMExtension("MASTER"));

    return master;
}


