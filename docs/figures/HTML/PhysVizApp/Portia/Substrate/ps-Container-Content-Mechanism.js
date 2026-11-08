// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a container that can hold things, 
// and can be indexed by fields of those things.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { AssertNotImplemented } from "../p-assertions.js";

// example dictionaryMap
// {
//     "container": "Container",
//     "content": "Content"
// }

// example extras for a container that can hold things, and can be indexed by fields of those things.
// {
//     "type": "Type:Thing.Host.container",
//     "name": "Name:myContainer",
//     "payload": {         
//         "field1": "value1",      
//         "field2": "value2",
//         "field3": "value3"
//     }
// }


//  this template is for a one to many relationship,  navigable ->


export class container extends Thing{           // a bit like a Table in database.
    constructor(dictionaryMap, extras) {
        super(extras.type, extras.name, extras.payload, extras);
        this.contentStorage = new Array();  // the storage for the things in this container.  can be an array, a linked list, or something else.
        this.indexes = new Map();  // map of field names to indexes for those fields in the container.
        this.type = extras.type ?? "Type:Thing.Host.container";
        this.name = extras.name;
        this.payload = extras.payload;
        this.extras = extras;
    }

    getcontent(slot) {        // return the content at the specified slot in the container.
        return this.contentStorage[slot];
    }
    setcontent(slot, content) {  // set the content at the specified slot in the container.
        this.contentStorage[slot] = content;
    }
    addcontent(content) {  // add the content to the container, and return a location for it.
        const slot = this.contentStorage.push(content) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(content, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removecontent(slot) {  // remove the content at the specified slot in the container.
        this.contentStorage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, value) {
        // search for a thing in the container that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.contentStorage[slot];
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

