import { Registry } from "./p-Registry.js";
import { RelCls } from "./p-Relation.js";
import { SmartFactory } from "./p-SmartFactory.js";

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
    "roles" :{
        Husband:Man,
        Wife:Woman
    }
});


 /*  
    
let marriageDonDani = await sfThing.build({
    "Identity": {
        name: "marriage",
        type: "Relation.Marriage"
    },
    "roles": {
        "Cls": marriageCls,
        "Husband": Don,
        "Wife": Dani
    }
});

*/
let HusbandCls = new RelCls(marriageCls, Man, "Husband", "Marriage", {aspects : {"Identity":{name: "Husband", type: "Relation.Cls.Marriage.Husband"}}});
let WifeCls = new RelCls(marriageCls, Woman, "Wife", "Marriage", {aspects : {"Identity":{name: "Wife", type: "Relation.Cls.Marriage.Wife"}}});
let marriageDonDani = await sfThing.MakeBaseThing("marriageDonDani", "Thing.Relation.Persons.Marriage");
await marriageDonDani.addNewAspect("Relation", "Relation", null);
let asRelation = marriageDonDani.as("Relation");
console.log ("asRelation", asRelation);
asRelation.LinkWithArcs(HusbandCls, Don);
asRelation.LinkWithArcs(WifeCls, Dani);




let temp;

temp= marriageDonDani.as("Relation").as("Husband")
console.log(temp) ;
temp= marriageDonDani.as("Relation").as("Wife")
console.log(temp) ;
temp= marriageDonDani.as("Relation").as("Cls")
console.log(temp) ;