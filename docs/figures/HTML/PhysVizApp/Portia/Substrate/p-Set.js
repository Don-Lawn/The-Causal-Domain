// ps-Set.js
console.log("Loading Set");

import { Identity } from "./p-Identity.js";
import { Index } from "./p-Index.js";
import { AssertNotImplemented, AssertNotNull } from "./p-assertions.js";

export class Set {           // a bit like a Table in database.
    constructor() { 
        this.elements = new Map();  // the elements in the Set, keyed by identity fields
        this.indexes = new Map();
        this.indexIdentityFields();
    }

    addElement(identity, element) {  // add the Element to the Set, and and index it accordingto identity
        AssertNotNull (identity.id, 'Set.addElement', `Identity.id is null or undefined`);
        this.elements.set(identity.id, element);
        for (const [fieldName, index] of this.indexes.entries()) {
            const value = this._getFieldValue(element, fieldName);
            if (value)
                index.addIndexEntry(value, element);
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
        // search for a thing in the Set that matches the criteria, and return it.
        const index = this.indexes.get(fieldName ?? "id");
        AssertNotNull (index, 'Set.findThing', `No index found for fieldName: ${fieldName}`);
        return index.map.get(key)   ;
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

