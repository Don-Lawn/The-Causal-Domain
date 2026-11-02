// ps-MetaModel.js
// This file is part of Portia, a referenceImplementation for 
// Pattern Oriented Architecture 
// Pattern-ORiented Transporatable Information Architecture.
// which also makes use of Model driven principles.

import { Identity } from "./ps-Identity.js";
import { Code } from "./ps-Thing.Code.js";
import { Node } from "./ps-Thing.Node.js";
import { Arc } from "./ps-Thing.Arc.js";
import { ArcClass } from "./ps-Thing.ArcClass.js";
import { Container, IdRef, Location } from "./ps-Container.js";

export class MetaModel {
    constructor(LoadFileName) {
        this.LoadFileName = LoadFileName;   // configurable via file

        
        // hard coded containers.  have to get the code first,  
        // then build its container, then put it in its container
        this.codeTypes = new Code("Type:", "Group of Types");
        this.codeTypeThings = new Code("Type:Thing", "Types", { ParentRef: this.codeTypes });
        this.codeContainer = new Code("Type:Thing.Container", "is of Type: Container", { ParentRef: this.codeTypeThings });
        this.codes = new Container(this.codeContainer,"Container Of all Codes", null, null);

        this.codes.storeThing(this.codeCode);
        this.AllContainers = new Container(this.codeContainer, "Top Level Container",null, null);
        this.AllContainers.storeThing(this.codes);

        this.load();

    
    }

    load() {
        this.nodes = new Container(null,null, { allowedContents: ["Node"] });
        this.arcs = new Container(null,null, { allowedContents: ["Arc"] });
        this.arcClasses = new Container(null,null, { allowedContents: ["ArcClass"] });
        this.codes = new Container(null,null, { allowedContents: ["Code"] });
        // hardcoded for now, but will be loaded from a file in the future.
        const GrpTypes = this.codes.storeThing(
            new Code("Grp:Thing.Types"));
        const codeNode = this.codes.storeThing(
            new Code("Thing.Node", { GroupRef: GrpTypes }));
        const codeArc = this.codes.storeThing(
            new Code("Thing.Arc", { GroupRef: GrpTypes }));
        const codeArcClass = this.codes.storeThing(
            new Code("Thing.ArcClass", { GroupRef: GrpTypes }));
        const codeContainers = this.codes.storeThing(
            new Code("Thing.Containers",{ GroupRef: GrpTypes }));
        const codeContainerDLL = this.codes.storeThing(
            new Code("Thing.Containers.DoublyLinkedList", { GroupRef: codeContainers    }));  

            
        this.nodes = new Container(null,null, { allowedContents: ["Node"] });
        this.arcs = new Container(null,null, { allowedContents: ["Arc"] });
        this.arcClasses = new Container(null,null, { allowedContents: ["ArcClass"] });
        this.AllContainers.storeThing(this.nodes);
        this.AllContainers.storeThing(this.arcs);
        this.AllContainers.storeThing(this.arcClasses);

        
        let ref;
        ref = this.CreateAndRegisterThing("Node",  "imy Test Node","Hello Node" );
        ref = this.CreateAndRegisterThing("Arc", "my Test Arc", "Hello Arc" );
        ref = this.CreateAndRegisterThing("ArcClass",  "my Test ArcClass", "Hello ArcClass" );
        const GroupRef = this.CreateAndRegisterThing("Code", "myTestGroup" );
        ref = this.CreateAndRegisterThing("Code", "my test code", "Hello Code", { "GroupRef": GroupRef } );
    }



    CreateAndRegisterThing (type,name,payload, extras = null) {
        const identity = new Identity(type,name);
        let thing=null;
        let location = null;
        
        if (type === "Code") {
            thing = new Code(name,payload, extras);
            location = this.codes.storeThing(thing);    
        } else if (type === "Node") {
            thing = new Node(name,payload, extras);
            location = this.nodes.storeThing(thing);
        } else if (type === "Arc") {
            thing = new Arc(name,payload, extras);
            location = this.arcs.storeThing(thing);
        } else if (type === "ArcClass") {
            thing = new ArcClass(name,payload,extras);
            location = this.arcClasses.storeThing(thing);
        }

        return new IdRef (thing.identity, location);
    }


};