// ps-GeneratedCodeTest.js

 import { Space } from "../ps-Thing.Space.js";
 

let space = new Space( {
    templateSubstitutions:{
        "%host%": "Space",
        "%guest%": "Axis"
    },
    outputFileName:"F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Space.js",
    "type": "Thing.Space",
    "name": "myTestSpace",
    "subRoles": ["Nodes","Arcs","Processes","Time","Meta"] 
    }); 

let foundAxis = space.findThing("identity.name", "Nodes");
console.log("Found Axis: ", foundAxis);