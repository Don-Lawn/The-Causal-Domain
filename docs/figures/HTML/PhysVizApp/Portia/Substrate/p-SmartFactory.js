// ps-SmartFactory.js
console.log("Loading SmartFactory");
import { JsonFile } from "./p-FileJson.js";
import { Aggregate } from "./p-Aggregate.js";
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";
import { PropertySet } from "./p-propertySet.js";
import { normalize } from "path";

export class SmartFactory {
    constructor(type) {
        this.instructionsFileName = Registry.getInstructions(type);
        AssertNotNull (this.instructionsFileName, `SmartFactory - No file of instructions found for type: ${type} 
            in file "./Metadata/metadata.factory.Map.typeToInstructions.json"`);
        const fs = new JsonFile(this.instructionsFileName);
        let txt = fs.readText();
        this.classInstructions = fs.deserialise(txt);
        AssertNotNull (this.classInstructions, `SmartFactory - No instructions found for type: ${type} 
            in file "./Metadata/metadata.factory.Map.typeToInstructions.json"`);
           
        this.clsPs = new PropertySet (this.classInstructions);
    }


    async processInstructions(aggr, instructionsPs) {
        if (! instructionsPs)
            return;
        if (!instructionsPs.tree.aspects)
            return;

        for (const [aspect, {cls, type, name, part}] of Object.entries(instructionsPs.tree.aspects)) {
            if (part)
                aggr.addAspect (aspect, part);
            else if (cls) {
                let aspectInstr = instructionsPs.tree.aspects[aspect];
                await aggr.addNewAspect(aspect, cls, aspectInstr);
            }
            else if (instructionsPs.tree.aspects && instructionsPs.tree.aspects[aspect])
                aggr.addAspect(aspect, instructionsPs.tree.aspects[aspect]);
        }
    }

    async build( objInstructions) {
        this.objInstructions = objInstructions;
        let result = new Aggregate(this.classInstructions, this.objInstructions);
        this.ps = new PropertySet (this.classInstructions);
        this.objPs = new PropertySet (this.objInstructions);
        this.ps.merge(this.objPs);

        await this.processInstructions(result, this.ps);

        return result;
    }


    MakeBaseThing( name, type )
    {   
        let metadata = {
            "Identity": {
                name: name,
                type: type,
                cls: "Identity"
            },
        }; 
        return this.build(metadata);   
    }

    MakeParentThing( name, type )
    {   
        let metadata = {
            "Identity": {
                name: name,
                type: type,
                cls: "Identity"
            },
            "Children": {
                name: "Children",
                type: "Collection.Children",
                cls: "Collection"
            }
        };   
        return this.build(metadata);
    }
}