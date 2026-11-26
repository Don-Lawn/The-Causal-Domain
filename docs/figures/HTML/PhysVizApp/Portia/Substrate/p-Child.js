// p-child.js
console.log("Loading Child");
import { SmartPtr } from "./p-SmartPtr.js";
import { BaseAspect } from "./p-BaseAspect.js";
import { AssertNotNull } from "./p-assertions.js";

// this class is an addable aspect for aggregates that are within a Parent aggregate
// via the collection mechanism.  Not the Aspect mechanism.
export class Child extends BaseAspect {
	constructor(cls, metadata) {
		super(cls, metadata);
	}

	setParent(parent) {
		AssertNotNull (parent, 'Child.setParent', `parent is null or undefined`);

		let parentAggregate = null;
			
		if (parent.constructor.name === "Collection") {
			parentAggregate = parent.hostPtr.target;    // parent is the host of the provided aspect.
		} else if (parent.constructor.name === "Aggregate") {
			parentAggregate = parent;
		}
	
		this.parentPtr = new SmartPtr(this, "parentAggregate",	parentAggregate);
	}
}

