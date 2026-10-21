// RDF.TestHarness.js
import { Class } from "./p-class.js";
import { Object } from "./p-object.js";
import { RelClass } from "./p-relClass.js";
import { Relationship } from "./p-relationship.js";
import { Graph } from "./p-graph.js";
import { RelClassEnd } from "./p-relClassEnd.js";   


function testRDF() {
    const graph = new Graph(
                            null, // id
                            "myTestGraph" // name
    );

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


    const marriage = new RelClass (
        null,          //  id
        "Marriage",    // name
        {               // Domain
            fromEndClass:RDFdefaultRelClassEnd,
            roleName:"spouse"
        }, 
        {               // Range   
            fromEndClass:RDFdefaultRelClassEnd,
            roleName:"spouse"
        }
    );  
    graph.addThing(marriage);
    
    const donDanielaMarriage = new Relationship ( 
        null,                    // id
        "DonDanielaMarriage", // name
        "Marriage",       // className
        don,            // fromObject   
        daniela         // toObject            
    );
    graph.addThing(donDanielaMarriage);
    donDanielaMarriage.attachObjects(don, daniela);
}
debugger
testRDF();