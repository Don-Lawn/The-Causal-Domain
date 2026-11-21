// p-thing.js
console.log("Loading Thing");
import { SmartPtr, Arc } from "./p-SmartPtr.js";
import { Aggregate } from "./p-Aggregate.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";

export class Thing {
    constructor(identity, cls, metadata) {
        this.cls = "Thing";
        this.metadata = metadata;
    }

}