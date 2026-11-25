// smartPtrTest.js

import { Registry } from "./p-Registry.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { Collection } from "./p-Collection.js";

Registry.initialise();

let sfThing = new SmartFactory("Thing");

let Edward = await sfThing.MakeParentThing("Ed", "Thing.Person.Man");
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man");
Edward.as("Children").addMember(Don);

const value = Collection._getFieldValue(Don, 'Host.Identity.name');