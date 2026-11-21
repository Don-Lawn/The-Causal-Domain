// p-vertex.js

//p-Relation.js

console.log("Loading Relation");
import { SmartPtr, Arc } from "./p-SmartPtr.js";
import { Aggregate } from "./p-Aggregate.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";



export class Vertex {
    constructor (cls, target) {
        this.cls = cls;
        this.outgoingArcs = new Set();
        this.incomingArcs = new Set();
    }    
}



export class VertexCls extends Vertex{
    constructor(domain, range, 
        forwardName, reversename,
        metadata) {
        super(domain, null); // Call the parent constructor
        this.domain = domain;           // 
        this.range = range;
        this.forwardName = forwardName;
        this.reversename = reversename;
        // this.forwardArcRole = forwardArcRole;
        // this.reverseArcRole = reverseArcRole;
        this.metadata = metadata;

    }
}