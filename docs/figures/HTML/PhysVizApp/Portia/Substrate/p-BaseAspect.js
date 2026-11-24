// p-thing.js
console.log("Loading Thing");
import { SmartPtr, Arc } from "./p-SmartPtr.js";
import { Aggregate } from "./p-Aggregate.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";

export class BaseAspect {
    constructor(identity, cls, metadata, host) {
        this.AspectCls = cls;
        this.metadata = metadata;
        this.host = host;
    }

    as (aspectName) {
        return this.hostPtr.as(aspectName);
    }
}