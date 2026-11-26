// smartPtrTest.js
console.log("Loading smartPtrtest.js");
import { Registry } from "./p-Registry.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Collection } from "./p-Collection.js";

Registry.initialise();

let sfThing = new SmartFactory("Thing");

let Edward = await sfThing.MakeParentThing("Ed", "Thing.Person.Man");
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man");
await Don.addNewAspect("Child","Child",null);
Edward.as("Children").addMember(Don);
console.log("Edward's Children: ", Edward.as("Children").members.values().next().value.as("Identity").name);
