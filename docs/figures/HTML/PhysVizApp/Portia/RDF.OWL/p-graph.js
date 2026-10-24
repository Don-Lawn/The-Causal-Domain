// p-Graph.js
import  { Container } from "../p-container.js";

export class Graph extends Container{
    constructor(id, name) {  
        super(id, name, "RDF.Graph");
        this.thingsByStereotype = new Map();    //index by stereotyp
        this.relsByFromEnd = new Map();
        this.relsByToEnd = new Map();
        this.relClassesByName = new Map();          // index by name
        this.relClassesById = new Map();          // index by id
    }

    addThing(thing) {
        super.addThing(thing);
        this.thingsByName.set(thing.identity.name, thing.identity.id);                // index by name        
        this.thingsByStereotype.set(thing.identity.stereotype, thing.identity.id);    // index by stereotype   
        if (thing.stereotype === "RDF.Relationship") {
            this.relsByFromEnd.set(thing.fromEnd, thing.identity.id);              // index by fromEnd
            this.relsByToEnd.set(thing.toEnd, thing.identity.id);                  // index by toEnd  
        }
        if (thing.stereotype === "RDF.RelClass") {
            this.relClassesByName.set(thing.identity.name, thing.identity.id);            // index by name
            this.relClassesById.set(thing.identity.id, thing.identity.id);                // index by id
        }
    }

    declareThis() {
        console.log(this.identity.stereotype + " " + this.identity.name );
        for (const [name, id] of this.thingsByName) {
            const thing = this.getThingById(id);
            thing.declareThis();    
        }
    }
}
