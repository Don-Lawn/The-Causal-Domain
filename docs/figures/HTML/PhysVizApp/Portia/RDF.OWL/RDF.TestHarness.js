// RDF.TestHarness.js
import { Class } from "./p-class.js";
import { Object } from "./p-object.js";
import { RelClass } from "./p-relClass.js";
import { Relationship } from "./p-relationship.js";
import { Graph } from "./p-graph.js";


function testRDF() {
    const graph = new Graph(id=null, name="myTestGraph", stereotype="RDF.Graph");
    const person = new Class (id=null, name="Person", stereotype="RDF.Class");
    const daniela = new Object (id=null, name="Daniela", stereotype="RDF.Object", className="Person");
    const don = new Object (id=null, name="Don", stereotype="RDF.Object", className="Person");
    graph.addThing(person);
    graph.addThing(daniela);
    graph.addThing(don);
    const marriage = new RelClass (id=null, 
        name="Marriage", 
        stereotype="RDF.Relationship",  
        fromEnd={
            className:"Person",
            multiplicity:"1",
            aggregation:"aggregation",
            navigable:true,
            roleName:"spouse",
        }, 
        toEnd={
            className:"Person",
            multiplicity:"1",
            aggregation:"aggregation",
            navigable:true,
            roleName:"spouse"
        });
    graph.addThing(marriage);
    marriage.attachClasses(person, person);
    const donDanielaMarriage = new Relationship (
        id=null, 
        name="DonDanielaMarriage", 
        stereotype="RDF.Relationship", 
        className="Marriage", 
        FromEnd={don},
        ToEnd={daniela}
    );
    donDanielaMarriage.attachObjects(don, daniela);
    graph.addThing(donDanielaMarriage);
}

testRDF