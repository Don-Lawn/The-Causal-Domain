// pv-master.js
import { BaseObject } from "./pv-baseObject.js";
import { BusExtension } from "./pv-BusExtension.js";
import { HintExtension } from "./pv-HintExtension.js";
import { FSMExtension } from "./pv-FSMExtension.js";
import { AnimatorExtension } from "./pv-animatorExtension.js";
import { DefaultLifecycleExtension } from "./pv-defaultLifeCycleExtension.js";


export function MasterFSM() {

    // Create MASTER identity object
    const master = new BaseObject("MASTERFSM");

    // MASTER has a bus but no parent
  
    const ext = new BusExtension("MASTERBUS", null);
    master.extend(ext);
    ext.createBus("MASTERBUS", null);

    // MASTER can have hints (optional but useful)
    master.extend(new HintExtension());

    // Attach the FSM to MASTER
    master.extend(new FSMExtension(null,"MASTERBUS"));

    // Attach the Animation Extension to MASTER
    master.extend(new AnimatorExtension());

    // set the FSM up with the default lifecycle transitions
    master.extend(new DefaultLifecycleExtension());


    return master;
}


