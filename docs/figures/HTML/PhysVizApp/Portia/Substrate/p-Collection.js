// p-Collection.js
console.log("Loading Collection");

import { Identity } from "./p-Identity.js";
import { Index } from "./p-Index.js";
import { AssertNotImplemented, AssertNotNull } from "./p-assertions.js";
import { SmartPtr } from "./p-SmartPtr.js";
import { BaseAspect } from "./p-BaseAspect.js";

export class Collection extends BaseAspect {           // a bit like a Table in database.
    constructor(metadata = null ) { 
        super("Collection", metadata);
        this.members = new Map();  // the elements in the Collection, keyed by identity fields
        this.indexes = new Map();
        this.indexIdentityFields();
        this.usageCount=0;
    }

    addMember(member) {  // add the Element to the Collection, and index it according to identity
        let identity = member.as("Identity");
        AssertNotNull (identity.id, 'Collection.addMember', `Identity.id is null or undefined`);
        // link them up
        this.members.set(identity.id, member); 
        let ch = member.as("Child");
        ch.setParent(this);

        for (const [fieldName, index] of this.indexes.entries()) {
            const value = Collection._getFieldValue(member, fieldName);
            if (value)
                index.addIndexEntry(value, member);
        }
    }


    // start indexing the field, by fieldName, so that we can find things by that field.
    indexField (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName));
    }

    indexIdentityFields ( ) {
        this.indexField("Identity.id");
        this.indexField("Identity.versionNumber");
        this.indexField("Identity.cls");
        this.indexField("Identity.type");
        this.indexField("Identity.name");
    }


    findThing (fieldName, key) {
        // search for a thing in the Collection that matches the criteria, and return it.
        const index = this.indexes.get(fieldName ?? "id");
        AssertNotNull (index, 'Collection.findThing', `No index found for fieldName: ${fieldName}`);
        return index.indexMap.get(key);
    }

    static _getFieldValue(obj, path) {
        let current = obj;

        for (const key of path.split('.')) {
            if (current == null) {
                return undefined;
            }
            switch (current.constructor.name)
            {
                case "Aggregate":
                    current = current.as(key);
                    break;
                case "Aspect":
                    current = current[key];
                    break;
                case "SmartPtr":
                    current = current.getTarget();
                    break;
                default:
                    current = current[key];
            }
        }

        return current;
    }
}

