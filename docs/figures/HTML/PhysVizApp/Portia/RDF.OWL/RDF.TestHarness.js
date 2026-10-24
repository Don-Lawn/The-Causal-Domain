// RDF.TestHarness.js
import { Class } from "./p-class.js";
import { Object } from "./p-object.js";
import { RelClass } from "./p-relClass.js";
import { Relationship } from "./p-relationship.js";
import { Graph } from "./p-graph.js";
import { RelClassEnd } from "./p-relClassEnd.js";   
import { Container } from "../p-container.js";


function testRDF() {

    // create a context for all hints/properties/propertysets, with hierarchical names
    const context = new Container (null, "context"); 

    // create a graph, which is also a container for all of the RDF things that make up the graph
    const graph = new Graph(
                            null, // id
                            "graph.main" // name
    );
    context.addThing(graph);

    // standard RDF relationship end
    //  navigable, 0..*, aggregation, anonymous, {false,false,false}
    const RDFdefaultRelClassEnd = new RelClassEnd(
        null,   // id       // id
        "RDFdefaultRelClassEnd", // name
        true,   // navigable
        -1,     // multiplicity
        "none", // aggregation
        "",     // roleName
        { symmetric: false, transitive: false, reflexive: false }       //owl
    );
    graph.addThing(RDFdefaultRelClassEnd);


    const person = new Class (
        null,           //id
        "Person"        //name
    );
    graph.addThing(person);


    const daniela = new Object (
        null,               //  id
        "Daniela",          //  name
        person            // class
    );
    graph.addThing(daniela);


    const don = new Object (
        null,               //  id
        "Don",              //  name
        person            // class
    );
    graph.addThing(don);


    const marriageRelClass = new RelClass (
        null,          //  id
        "isMarriedTo",    // name
        {               // Domain
            class: person,    //domain class
            endClass:RDFdefaultRelClassEnd,   // multiplicity, navigability etc
            roleName:"husband"
        }, 
        {               // Range   
            class: person,          // rangeClass
            endClass:RDFdefaultRelClassEnd,  // multiplicity, navigability
            roleName:"wife"
        }
    );  
    graph.addThing(marriageRelClass);
    
    const donDanielaMarriage = new Relationship ( 
        null,                    // id
        "DonDanielaMarriage", // name
        marriageRelClass,       // relclass
        don,            // fromObject   
        daniela         // toObject            
    );
    graph.addThing(donDanielaMarriage);

    graph.declareThis();
}
debugger
testRDF();