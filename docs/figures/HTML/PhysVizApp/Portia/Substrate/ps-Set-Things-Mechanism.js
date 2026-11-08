// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a set that can hold things, 
// and can be indexed by fields of those things.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { AssertNotImplemented } from "../p-assertions.js";

// example dictionaryMap
// {
//     "set": "Container",
//     "element": "Content"
// }

// example extras for a set that can hold things, and can be indexed by fields of those things.
// {
//     "type": "Type:Thing.Host.set",
//     "name": "Name:myContainer",
//     "payload": {         
//         "field1": "value1",      
//         "field2": "value2",
//         "field3": "value3"
//     }
// }


//  this template is for a one to many relationship,  navigable ->


export class set extends Thing{           // a bit like a Table in database.
    constructor(dictionaryMap, extras) {
        super(extras.type, extras.name, extras.payload, extras);
        this.elementStorage = new Array();  // the storage for the things in this set.  can be an array, a linked list, or something else.
        this.indexes = new Map();  // map of field names to indexes for those fields in the set.
        this.type = extras.type ?? "Type:Thing.Host.set";
        this.name = extras.name;
        this.payload = extras.payload;
        this.extras = extras;
    }

    getelement(slot) {        // return the element at the specified slot in the set.
        return this.elementStorage[slot];
    }
    setelement(slot, element) {  // set the element at the specified slot in the set.
        this.elementStorage[slot] = element;
    }
    addelement(element) {  // add the element to the set, and return a location for it.
        const slot = this.elementStorage.push(element) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(element, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removeelement(slot) {  // remove the element at the specified slot in the set.
        this.elementStorage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, value) {
        // search for a thing in the set that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.elementStorage[slot];
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

