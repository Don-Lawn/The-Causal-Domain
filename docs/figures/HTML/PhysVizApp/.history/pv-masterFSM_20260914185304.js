// pv-master.js
import { ActiveEntity } from "./pv-baseObject.js";
import EventBusInstance from "./pv-eventBus.js";


export function MasterFSM() {

    // Create MASTER identity object
    const master = new BaseObject("MASTER");

    // MASTER has a bus but no parent
    master.extend(new BusExtension("MASTER", null));

    // MASTER can have hints (optional but useful)
    master.extend(new HintExtension());

    // Attach the FSM to MASTER
    master.extend(new FSMExtension("MASTER_FSM", "MASTER"));

    return master;
}


