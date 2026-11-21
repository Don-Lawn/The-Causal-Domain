// ps-SmartFactory.js
console.log("Loading SmartFactory");
import { JsonFile } from "./p-FileJson.js";
import { Aggregate } from "./p-Aggregate.js";
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";

export class SmartFactory {
    constructor(type) {
        this.instructionsFileName = Registry.getInstructions(type);
        AssertNotNull (this.instructionsFileName, `SmartFactory - No file of instructions found for type: ${type} 
            in file "./metadata/metadata.factory.typeToInstructions.json"`);
        const fs = new JsonFile(this.instructionsFileName);
        let txt = fs.readText();
        this.classInstructions = fs.deserialise(txt);
        AssertNotNull (this.classInstructions, `SmartFactory - No instructions found for type: ${type} 
            in file "./metadata/metadata.factory.typeToInstructions.json"`);
    }


    async build( objInstructions) {
        this.objInstructions = objInstructions;
        let result = new Aggregate(this.classInstructions, this.objInstructions);

        for (const [role, {cls, type, name, part}] of Object.entries(this.classInstructions.roles)) {
            if (part)
                result.addPart (role, part);
            else if (cls)
                await result.addNewPart(role, cls, this.objInstructions[role]);
            else if (this.objInstructions["Roles"] && this.objInstructions["Roles"][role])
                result.addPart(role, this.objInstructions["Roles"][role]);
        }

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
                type: "Set.Children",
                cls: "Set"
            }
        };   
        return this.build(metadata);
    }
}