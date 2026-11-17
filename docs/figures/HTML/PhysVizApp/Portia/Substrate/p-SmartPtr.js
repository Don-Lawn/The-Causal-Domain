// ps-SmartPtr.js
import { Identity } from "./p-Identity.js";
import { Set } from "./p-Set.js";

export class SmartPtr {
    constructor(host,target) {
        this.host = host;
        this.target  = target;
        target.usageCount ++;

        this.targetIdentity = target?.identity ?? null;
    }   

    get() {
        if (! this.target) {
            return this.host.container.findThing(this.targetIdentity);
        } else {
            return this.target;
        }
    }
}