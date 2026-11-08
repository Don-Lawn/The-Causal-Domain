// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a aggregate that can hold things, 
// and can be indexed by fields of those things.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { AssertNotImplemented } from "../p-assertions.js";

// example dictionaryMap
// {
//     "aggregate": "Container",
//     "partialObject": "Content"
// }

// example extras for a aggregate that can hold things, and can be indexed by fields of those things.
// {
//     "type": "Type:Thing.Host.aggregate",
//     "name": "Name:myContainer",
//     "payload": {         
//         "field1": "value1",      
//         "field2": "value2",
//         "field3": "value3"
//     }
// }


//  this template is for a one to many relationship,  navigable ->


export class aggregate extends Thing{           // a bit like a Table in database.
    constructor(dictionaryMap, extras) {
        super(extras.type, extras.name, extras.payload, extras);
        this.partialObjectStorage = new Array();  // the storage for the things in this aggregate.  can be an array, a linked list, or something else.
        this.indexes = new Map();  // map of field names to indexes for those fields in the aggregate.
        this.type = extras.type ?? "Type:Thing.Host.aggregate";
        this.name = extras.name;
        this.payload = extras.payload;
        this.extras = extras;
    }

    getpartialObject(slot) {        // return the partialObject at the specified slot in the aggregate.
        return this.partialObjectStorage[slot];
    }
    setpartialObject(slot, partialObject) {  // set the partialObject at the specified slot in the aggregate.
        this.partialObjectStorage[slot] = partialObject;
    }
    addpartialObject(partialObject) {  // add the partialObject to the aggregate, and return a location for it.
        const slot = this.partialObjectStorage.push(partialObject) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(partialObject, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removepartialObject(slot) {  // remove the partialObject at the specified slot in the aggregate.
        this.partialObjectStorage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, value) {
        // search for a thing in the aggregate that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.partialObjectStorage[slot];
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

