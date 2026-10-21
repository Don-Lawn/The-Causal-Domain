// p-Graph.js
import  { Thing } from "../p-thing.js";
import  { Container } from "../p-container.js";

export class Graph extends Container{
    constructor(id, name) {  
        super(id, name, "RDF.Graph");
        this.thingsByName = new Map();          // index by name
        this.thingsByStereotype = new Map();    //index by stereotype
        this.relsByFromEnd = new Map();
        this.relsByToEnd = new Map();
        this.relClassesByName = new Map();          // index by name
        this.relClassesById = new Map();          // index by id
    }

    addThing(thing) {
        super.addThing(thing);
        this.thingsByName.set(thing.name, thing.id);                // index by name        
        this.thingsByStereotype.set(thing.stereotype, thing.id);    // index by stereotype   
        if (thing.stereotype === "RDF.Relationship") {
            this.relsByFromEnd.set(thing.fromEnd, thing.id);              // index by fromEnd
            this.relsByToEnd.set(thing.toEnd, thing.id);                  // index by toEnd  
        }
        if (thing.stereotype === "RDF.RelClass") {
            this.relClassesByName.set(thing.name, thing.id);            // index by name
            this.relClassesById.set(thing.id, thing.id);                // index by id      
        }
    }
}
