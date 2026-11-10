//ps-ProcessTemplateTest.js
import { processTemplate } from "./ps-ProcessTemplate.js";
import { FileHandler } from "../Files/ps-FileHandler.js";



function Build (templateFileName,templateMap, targetFileName, extras) {
    const fh = new FileHandler(templateFileName);
    const templateContent = fh.readFileSync();
    const code = processTemplate(templateContent, templateMap, extras);
    const fh2 = new FileHandler(targetFileName);
    fh2.writeFileSync(code);
}

const HostGuestTemplateFileName =    "F:/Projects/PhysViz/Portia/Substrate/Templates/ps-Host.Guest.Template.txt";

// App
Build (
    HostGuestTemplateFileName,
    {
        "%host%": "App",
        "%guest%": "Axis"
    },
    "F:/Projects/PhysViz/Portia/Substrate/ps-Thing.App.Generated.js",     
    {
        "type": "Thing.%host%",
        "name": "theApp",
        "payload": { }
    }
);
    
// Axis
Build (
    HostGuestTemplateFileName,
    {
        "%host%": "Axis",
        "%guest%": "Node"
    },
    "F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Axis.Generated.js",     
    {
        "type": "Thing.%host%",
        "name": "nodes",
        "payload": { }
    }
);


// NA Plane   = Grid
Build( 
    HostGuestTemplateFileName,
    {
        "%host%": "Graph",
        "%guest%": "Axis"
    },
    "F:/Projects/PhysViz/Portia/Substrate/ps-Thing.Plane.Graph.Generated.js",
    {
        "type": "Thing.Plane.Graph",
        "name": "Graph",
        "payload": { }
    });



// PI Plane   = OO.

