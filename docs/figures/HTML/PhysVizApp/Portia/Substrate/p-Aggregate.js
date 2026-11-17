// ps-Aggregate.js

import { Identity } from "./p-Identity.js";
import { Set }  from "./p-Set.js";
import { Index } from "./p-Index.js";
import { JSModule } from "./p-JSModule.js"; 
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";

export class Aggregate
{
    constructor(metadata)
    {
        // add the parts Set immediately, so that addPart can use it to keep metadata specufied parts in.
        this.parts = new Set();
        // add the roleIndex immediately, so that addPart can use it to keep track of the parts in the aggregate.
        this.roleIndex = new Index(metadata.roles);  // map of role names to parts in the aggregate.
        
        // now we can add the mandatory parts, Identity, to the aggregate.
        this.addPart("Identity", Identity);
        this.metadata = metadata;
    }

    async addPart(role, type) {
        const sourceFileName = Registry.getFile(type);
        AssertNotNull (sourceFileName,
            `Role '${role}' not found in metadata.roles for aggregate type '${this.metadata.type}'`); 

        let module = new JSModule(sourceFileName);
        await module.load();
        const obj = module.createObject(this.metadata);
        this.roleIndex.addIndexEntry(role, obj);
        return obj;
    }

    removePart(role, metadata) {
        // Implementation for adding a part to the aggregate
    }

    getRoleObject(role) {   
        return this.roleIndex.get(role);
    }
}