//p-Relation.js

console.log("Loading Relation");
import { SmartPtr, Arc } from "./p-SmartPtr.js";
import { Aggregate } from "./p-Aggregate.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";
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
    AddNewRole (role,  cls, target) {
        let relation = this;                    //   just making it clear.


        // add the arc from relation to target.
        let toArc = new Arc(relation, cls, target);

        // add the reverse arc from target to relation.
        let fromArc = new Arc(target, cls, relation);
        this.LinkRelationWithArcs(relation, target, toArc, fromArc);
        this.LinkVertexesWithArcs(role, target, toArc, fromArc);

    }

    LinkRelationWithArcs (relation, target, arcForward, arcReverse) {
        relation.outgoingArcs.addElement(arcForward); // add the arc to the relation's outgoing arcs
        target.incomingArcs.addElement(arcForward); // add the arc to the target's incoming arcs
        relation.incomingArcs.addElement(arcReverse); // add the arc to the relation's incoming arcs
        target.outgoingArcs.addElement(arcReverse); // add the arc to the target's outgoing arcs
    }
    LinkVertexesWithArcs (source, target, arcForward, arcReverse) {
        source.outgoingArcs.addElement(arcForward); // add the arc to the source's outgoing arcs
        target.incomingArcs.addElement(arcForward); // add the arc to the target's incoming arcs
        source.incomingArcs.addElement(arcReverse); // add the arc to the source's incoming arcs
        target.outgoingArcs.addElement(arcReverse); // add the arc to the target's outgoing arcs
    }

}   


export class RelCls extends Relation{
    constructor(domain, range, 
        forwardName, reversename, 
        metadata) {
        super(null);     // Call the parent constructor
        this.domain = domain;           // 
        this.range = range;
        this.forwardName = forwardName;
        this.reversename = reversename;
        this.metadata = metadata;

    }
}

Registry.initialise();

const sfThing = new SmartFactory("Thing");
let Person = await sfThing.MakeBaseThing("Person", "Thing.Cls.Person");
let Man = await sfThing.MakeBaseThing("Man", "Thing.Cls.Man");
let Woman = await sfThing.MakeBaseThing("Woman", "Thing.Cls.Woman");
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man");
let Dani = await sfThing.MakeBaseThing("Dani", "Thing.Person.Woman");

let marriageCls = await sfThing.build({
    "Identity": {
        name: "marriageCls", 
        type: "Relation.Cls.Marriage"  
    },
    Roles :{
        Husband:Man,
        Wife:Woman
    }
});


    
    
let marriageDonDani = await sfThing.build({
    "Identity": {
        name: "marriage",
        type: "Relation.Marriage"
    },
    "Roles": {
        "Cls": marriageCls,
        "Husband": Don,
        "Wife": Dani
    }
});

