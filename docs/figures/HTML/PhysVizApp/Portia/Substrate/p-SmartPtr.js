// ps-SmartPtr.js
console.log("Loading SmartPtr");
import { Identity } from "./p-Identity.js";
import { Set } from "./p-Set.js";

export class SmartPtr {
    constructor(host,role,target) {
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

export { SmartPtr as Arc };