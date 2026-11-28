import { Registry } from "./p-Registry.js";
import { SmartFactory } from "./p-SmartFactory.js";
import { PropertySet } from "./p-propertySet.js";

Registry.initialise();


const nodePS = Registry.getInstructionsAsPS("Node");
