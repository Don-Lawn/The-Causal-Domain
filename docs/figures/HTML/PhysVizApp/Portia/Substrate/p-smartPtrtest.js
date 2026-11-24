// smartPtrTest.js

import { Registry } from "./p-Registry.js";
import { SmartFactory } from "./p-SmartFactory.js";

Registry.initialise();

let sfThing = new SmartFactory("Thing");

let Edward = await sfThing.MakeParentThing("Ed", "Thing.Person.Man");
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man");
let ch = Edward.as("Children");
ch.members.add(Don);
