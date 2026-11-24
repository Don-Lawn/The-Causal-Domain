// p-vertex.js
console.log("Loading Vertex");
import { SmartPtr, Arc } from "./p-SmartPtr.js";
import { Aggregate } from "./p-Aggregate.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";
import { Collection } from "./p-Collection.js";
    


export class Vertex {
    constructor (cls) {
        this.cls = cls;
        this.outgoingArcs = new Collection();
        this.incomingArcs = new Collection();
    }    
}



export class VertexCls extends Vertex{
    constructor(domain, range, 
        forwardName, reversename,
        metadata) {
        super(null); // Call the parent constructor
        this.domain = domain;           // 
        this.range = range;
        this.forwardName = forwardName;
        this.reversename = reversename;
        // this.forwardArcAspect = forwardArcAspect;
        // this.reverseArcAspect = reverseArcAspect;
        this.metadata = metadata;

    }
}