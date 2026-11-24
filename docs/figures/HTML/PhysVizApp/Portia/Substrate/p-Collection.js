// p-Collection.js
console.log("Loading Collection");

import { Identity } from "./p-Identity.js";
import { Index } from "./p-Index.js";
import { AssertNotImplemented, AssertNotNull } from "./p-assertions.js";

export class Collection {           // a bit like a Table in database.
    constructor() { 
        this.members = new Map();  // the elements in the Collection, keyed by identity fields
        this.indexes = new Map();
        this.indexIdentityFields();
        this.usageCount=0;
    }

    addMember(identity, member) {  // add the Element to the Collection, and index it according to identity
        AssertNotNull (identity.id, 'Collection.addMember', `Identity.id is null or undefined`);
        this.members.set(identity.id, member);
        for (const [fieldName, index] of this.indexes.entries()) {
            const value = this._getFieldValue(member, fieldName);
            if (value)
                index.addIndexEntry(value, member);
        }
    }


    // start indexing the field, by fieldName, so that we can find things by that field.
    indexField (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName));
    }

    indexIdentityFields ( ) {
        this.indexField("identity.id");
        this.indexField("identity.versionNumber");
        this.indexField("identity.cls");
        this.indexField("identity.type");
        this.indexField("identity.name");
    }


    findThing (fieldName, key) {
        // search for a thing in the Collection that matches the criteria, and return it.
        const index = this.indexes.get(fieldName ?? "id");
        AssertNotNull (index, 'Collection.findThing', `No index found for fieldName: ${fieldName}`);
        return index.indexMap.get(key);
    }

    _getFieldValue(obj, path) {
        let current = obj;

        for (const key of path.split('.')) {
            if (current == null) {
                return undefined;
            }
            current = current[key];
        }

        return current;
    }
}

