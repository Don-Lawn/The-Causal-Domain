// ps-Aggregate.js
console.log("Loading Aggregate");
import { Identity } from "./p-Identity.js";
import { Set }  from "./p-Set.js";
import { Index } from "./p-Index.js";
import { JSModule } from "./p-JSModule.js"; 
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";
import { type } from "os";

export class Aggregate   // not really the whole aggregate - just the part that acts as the facade and holds the other parts

{
    constructor(typeInstructions, objInstructions)
    {
        // add the parts Set immediately, so that addPart can use it to keep metadata specufied parts in.
        this.parts = new Set();
        // add the roleIndex immediately, so that addPart can use it to keep track of the parts in the aggregate.
        this.roleIndex = new Index(typeInstructions.roles);  // map of role names to parts in the aggregate.
        
        this.typeInstructions = typeInstructions;

    }

    addPart(role, part) {
        this.parts.addElement(role, part);
    }


    async addNewPart(role, cls, objInstructions) {
        const sourceFileName = Registry.getFile(cls);
        AssertNotNull (sourceFileName, 'Aggregate.addNewPart', `Class '${cls}' not found in metadata.roles for aggregate type '${cls}'`); 

        let module = new JSModule(sourceFileName);
        await module.load();
        const obj = module.createObject(this.typeInstructions);
        this.roleIndex.addIndexEntry(role, obj);
        this.addPart(role, obj);
    }

    removePart(role, metadata) {
        // Implementation for adding a part to the aggregate
    }

    getRoleObject(role) {   
        return this.roleIndex.get(role);
    }
}
