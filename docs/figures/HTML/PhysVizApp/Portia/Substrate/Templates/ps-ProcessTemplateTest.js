//ps-ProcessTemplateTest.js
import { TemplateProcessor } from "./ps-TemplateProcessor.js";




const tp = new TemplateProcessor();
const HostGuestTemplateFileName =    "F:/Projects/PhysViz/Portia/Substrate/Templates/ps-Host.Guest.Template.txt";

// app
// tp.runFromMetadataFile("F:/Projects/PhysViz/Portia/Substrate/Metadata/Metadata.App.json");

// Space
tp.runFromMetadataFile("F:/Projects/PhysViz/Portia/Substrate/Metadata/Metadata.Space.json");

//Axis
tp.runAndTest({
    "templateFileName": HostGuestTemplateFileName,
    "templateSubstitutions": {
        "%host%": "Axis",
        "%guest%": "Node"
    },
    "outputFileName": "F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Axis.js",
    "type": "Thing.Axis",
    "name": "nodes",
    "subRoles": ["Nodes","Arcs","Processes","Time.Events", "Time.Plans", "Meta"]
    });

// Graph
tp.runAndTest({
    templateFileName:HostGuestTemplateFileName,
    templateSubstitutions:{
        "%host%": "Graph",
        "%guest%": "Axis"
    },
    outputFileName:"F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Plane.Graph.js",
    "type": "Thing.Plane.Graph",
    "name": "Graph",
    "subRoles": ["Nodes","Arcs"] 
    });

// Space    
tp.runAndTest({
    templateFileName:HostGuestTemplateFileName,
    templateSubstitutions:{
        "%host%": "Space",
        "%guest%": "Axis"
    },
    outputFileName:"F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Space.js",
    "type": "Thing.Space",
    "name": "myTestSpace",
    "subRoles": ["Nodes","Arcs","Processes","Time","Meta"] 
    }); 
