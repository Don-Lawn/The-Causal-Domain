// ps-Aggregate.js
console.log("Loading Aggregate");
import { Collection }  from "./p-Collection.js";
import { SmartPtr } from "./p-SmartPtr.js";
import { Index } from "./p-Index.js";
import { JSModule } from "./p-JSModule.js"; 
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";
import { type } from "os";

export class Aggregate   // not really the whole aggregate - just the part that acts as the facade and holds the other parts

{
    constructor(typeInstructions, objInstructions)
    {
        // add the parts Collection immediately, so that addPart can use it to keep metadata specufied parts in.
        this.indexAspectToParts = new Index();
        
        this.typeInstructions = typeInstructions;

        this.incomingArcs = new Collection();
        this.outgoingArcs = new Collection();

        this.usageCount=0;

    }

    addAspect(role, part) {
        this.indexAspectToParts.addIndexEntry(role, part);
        part.setHost(this);
    }


    async addNewAspect(role, cls, objInstructions) {
        const sourceFileName = Registry.getFile(cls);
        AssertNotNull (sourceFileName, 'Aggregate.addNewPart', `Class '${cls}' not found in metadata.roles for aggregate type '${cls}'`); 

        let module = new JSModule(sourceFileName, cls);
        await module.load();
        const obj = module.createObject(objInstructions);
        this.addAspect(role, obj);
    }

    removeAspect(role, metadata) {
        // Implementation for adding a part to the aggregate
    }

    as(role) {   
        return this.indexAspectToParts.findObjectByKey(role);
    }
}
