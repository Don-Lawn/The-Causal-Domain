//ps-SmartFactoryTest.js
console.log("Loading SmartFactoryTest");
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";

Registry.initialise();

const sfThing = new SmartFactory("Thing");
let Don = await sfThing.MakeBaseThing("Don", "Thing.Person.Man");
let Dani = await sfThing.MakeBaseThing("Dani", "Thing.Person.Woman");




