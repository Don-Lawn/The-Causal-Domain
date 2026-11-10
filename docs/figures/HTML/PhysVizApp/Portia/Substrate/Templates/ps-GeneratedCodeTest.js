// ps-GeneratedCodeTest.js

 import { App } from "../ps-Thing.App.Generated.js";
 import { Axis } from "../ps-Thing.Axis.Generated.js";
 import { Graph } from "../ps-Thing.Plane.Graph.Generated.js";
 

 
let graph = new Graph( "Thing.Plane.Graph", "Test Graph", {}, {});
graph.addNewAxis({"type": "Thing.Plane.Graph.Axis", "name": "nodeAxis", "payload": {}, "extras": {
    child : {"type": "Thing.Axis", "name": "nodes", "payload": {}, "extras": {}}
}});

graph.addNewAxis({"type": "Thing.Plane.Graph.Axis", "name": "arcAxis", "payload": {}, "extras": {
    child : {"type": "Thing.Axis", "name": "arcs", "payload": {}, "extras": {}}
}});


let app = new App( "Thing.App", "App", {}, {});
let axis = new Axis( "Thing.Axis", "Nodes", {}, {});
app.addNewAxis({"type": "Thing.Axis", "name": "Nodes", "payload": {}, "extras": {}});
let foundAxis = app.findThing("name", "Nodes");
