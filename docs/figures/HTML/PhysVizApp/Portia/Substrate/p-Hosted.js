// p-hosted.js
import { SmartPtr } from "./p-SmartPtr.js";
import { BaseAspect } from "./p-BaseAspect.js";
import { AssertNotNull } from "./p-assertions.js";

// this class is and addable aspect for aggregates that are within a Host aggregate
// via the collection mechanism.  Not the Aspect mechanism.
export class Hosted extends BaseAspect {
	constructor(host = null) {
        AssertNotNull (host, 'Hosted.constructor', `host is null or undefined`);
		this.hostPtr = new SmartPtr(host);
	}
}

