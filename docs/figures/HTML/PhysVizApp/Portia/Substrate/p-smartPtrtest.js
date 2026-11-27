// smartPtrTest.js
console.log("Loading p-smartPtrtest.js");
import { Registry } from "./p-Registry.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Collection } from "./p-Collection.js";
import { ListNav } from "./p-BaseIterator.js";

Registry.initialise();

let sfThing = new SmartFactory("Thing");

let Edward = await sfThing.MakeParentThing("Ed", "Thing.Person.Man");
let noone = await sfThing.MakeBaseThing("Noone", "Thing.Person.Man",{aspects:{"Child":{cls:"Child"}}});
//await noone.addNewAspect("Child","Child",{aspects: {"Child": "Child"}}  );
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man",{aspects:{"Child":{cls:"Child"}}});
//await Don.addNewAspect("Child","Child",null);
Edward.as("Children").addMember(Don);
Edward.as("Children").addMember(noone);
let ch=Edward.as("Children").getIterator();


console.log("Iterator:", ch.constructor.name);

while (ch.move(ListNav.SUCCESSOR)){
    let child = ch.current();
    console.log("Child: ", child.as("Identity").name);
}
console.log("Edward's Children: ", Edward.as("Children").members.values().next().value.as("Identity").name);
