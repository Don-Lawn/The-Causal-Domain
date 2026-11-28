//ps-SmartFactoryTest.js
console.log("Loading SmartFactoryTest");
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";
import { PropertySet } from "./p-propertySet.js";

Registry.initialise();

// Registry should cache things to avoid going back to disk, reparsing code.
// things that are cached should be indexed by type.
// I wonder if a collection is appropriate?
// If so, then registry becomes an Aggregate, with Children,   with a registry Facet
// maybe multiple types of registration,  with a registry Facet for each type of registration.
// the things added to registry should be advanced structures, ready for use.
// i.e. capabilities should have been resolved.

const sfThing = new SmartFactory("God");

let Odin = await sfThing.build();





