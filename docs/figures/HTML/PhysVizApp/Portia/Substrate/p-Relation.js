//p-Relation.js

console.log("Loading Relation");
import { Arc } from "./p-SmartPtr.js";
import { Vertex } from "./p-Vertex.js";


// a compound relation is kind-of an anti-vertex.   
// dependencies run form anti-vertexes to vertexes.
export class Relation extends Vertex{      
    constructor (cls) {
        super (cls)

        // make the Relation object, which is THIS
        // nothing to do


    }

    // host it where the tail of the arc attaches.
    // target is where the head of the arc attaches.
    // the arc must also be added to the ingoing/outgoing of the relation, and its element
    LinkWithArcs(cls, target) {
        let relation = this;                    //   just making it clear.


        // add the arc from relation to target.
        let toArc = new Arc(relation, cls, target);
        // add the reverse arc from target to relation.
        let fromArc = new Arc(target, cls, relation.host);

        this.LinkRelationWithArcs(target, toArc, fromArc);
        this.LinkVertexesWithArcs(this, target, toArc, fromArc);

    }

    LinkRelationWithArcs (target, arcForward, arcReverse) {
        let relation = this;
        relation.outgoingArcs.addMember(arcForward); // add the arc to the relation's outgoing arcs
        target.incomingArcs.addMember(arcForward); // add the arc to the target's incoming arcs
        relation.incomingArcs.addMember(arcReverse); // add the arc to the relation's incoming arcs
        target.outgoingArcs.addMember(arcReverse); // add the arc to the target's outgoing arcs
    }
    LinkVertexesWithArcs (source, target, arcForward, arcReverse) {
        source.outgoingArcs.addMember(arcForward); // add the arc to the source's outgoing arcs
        target.incomingArcs.addMember(arcForward); // add the arc to the target's incoming arcs
        source.incomingArcs.addMember(arcReverse); // add the arc to the source's incoming arcs
        target.outgoingArcs.addMember(arcReverse); // add the arc to the target's outgoing arcs
    }

}   


export class RelCls extends Relation{
    constructor(domain, range, 
        forwardName, reversename, 
        metadata) {
        super(metadata);     // Call the parent constructor
        this.domain = domain;           // 
        this.range = range;
        this.forwardName = forwardName;
        this.reversename = reversename;
        this.metadata = metadata;

    }
}

export class ArcCls extends Relation{
    constructor(range, 
        forwardName, reversename, 
        metadata) {
        super(metadata);     // Call the parent constructor
        this.range = range;
        this.forwardName = forwardName;
        this.reversename = reversename;
        this.metadata = metadata;

    }
}

