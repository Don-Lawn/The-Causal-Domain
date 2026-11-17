//ps-SmartFactoryTest.js
import { SmartFactory } from "./p-SmartFactory.js";
import { Registry } from "./p-Registry.js";

Registry.initialise();

const sf = new SmartFactory("TreeNode");

// Treenode
sf.build();
