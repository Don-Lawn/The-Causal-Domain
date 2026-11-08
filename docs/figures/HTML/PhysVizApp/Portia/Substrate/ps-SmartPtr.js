// ps-SmartPtr.js
import { Identity } from "./ps-Identity.js";
import { Container} from "./ps-Thing.Container.js";

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