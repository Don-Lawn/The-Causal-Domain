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
        this.indexRoleToParts = new Index();
        
        this.typeInstructions = typeInstructions;

    }

    addPart(role, part) {
        this.indexRoleToParts.addIndexEntry(role, part);
    }


    async addNewPart(role, cls, objInstructions) {
        const sourceFileName = Registry.getFile(cls);
        AssertNotNull (sourceFileName, 'Aggregate.addNewPart', `Class '${cls}' not found in metadata.roles for aggregate type '${cls}'`); 

        let module = new JSModule(sourceFileName, cls);
        await module.load();
        const obj = module.createObject(objInstructions);
        this.addPart(role, obj);
    }

    removePart(role, metadata) {
        // Implementation for adding a part to the aggregate
    }

    getRoleObject(role) {   
        return this.indexRoleToParts.findObjectByKey(role);
    }
}
