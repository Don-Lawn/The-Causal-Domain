// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a Axis that can hold things, 
// and can be indexed by fields of those things.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { Node } from "./ps-Thing.Node.js";
import { AssertNotImplemented } from "../p-assertions.js";

// example dictionaryMap
// {
//     "Axis": "Container",
//     "Node": "Content"
// }

// example extras for a Axis that can hold things, and can be indexed by fields of those things.
// {
//     "type": "Type:Thing.Host.Axis",
//     "name": "Name:myContainer",
//     "payload": {         
//         "field1": "value1",      
//         "field2": "value2",
//         "field3": "value3"
//     }
// }


//  this template is for a one to many relationship,  navigable ->


export class Axis extends Thing{           // a bit like a Table in database.
    constructor(type, name, payload, extras) {
        super(type, name, payload, extras);
        this.NodeStorage = new Array();  // the storage for the things in this Axis.  can be an array, a linked list, or something else.
        this.indexes = new Map();  // map of field names to indexes for those fields in the Axis.
        this.indexIdentityFields()
        this.type = extras.type ?? "Type:Thing.Host.Axis";
        this.name = extras.name;
        this.payload = extras.payload;
        this.extras = extras;
    }

    getNode(slot) {        // return the Node at the specified slot in the Axis.
        return this.NodeStorage[slot];
    }
    _setNode(slot, Node) {  // set the Node at the specified slot in the Axis.
        this.NodeStorage[slot] = Node;
    }
    addNewNode(extras) {  
        const newNode = new Node ("Thing.Node", extras.name, {},{  });
        const slot = this.NodeStorage.push(newNode) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(Node, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removeNode(slot) {  // remove the Node at the specified slot in the Axis.
        this.NodeStorage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, value) {
        // search for a thing in the Axis that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.NodeStorage[slot];
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

