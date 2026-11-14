// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a Graph that can hold things, 
// and can be indexed by fields of those things.

import { Thing } from "./ps-Thing.js";
import { Index } from "./ps-Index.js";
import { Axis } from "./ps-Thing.Axis.js";
import { AssertNotImplemented } from "./p-assertions.js";

// example dictionaryMap
// {
//     "Graph": "Container",
//     "Axis": "Content"
// }

// example extras for a Graph that can hold things, and can be indexed by fields of those things.
// {
//     "type": "Type:Thing.Host.Graph",
//     "name": "Name:myContainer",
//     "payload": {         
//         "field1": "value1",      
//         "field2": "value2",
//         "field3": "value3"
//     }
// }


//  this template is for a one to many relationship,  navigable ->


export default class Graph extends Thing{           // a bit like a Table in database.
    constructor(metadata) {
        super(metadata);
        this.AxisStorage = new Array();  // the storage for the things in this Graph.  can be an array, a linked list, or something else.
        this.type = metadata.type ?? "Type:Thing.Graph";
        this.name = metadata.name;
        this.payload = metadata.payload;
        this.metadata = metadata;
        this.addAllAxis(metadata)
    }

    getAxis(slot) {        // return the Axis at the specified slot in the Graph.
        return this.AxisStorage[slot];
    }
    _setAxis(slot, Axis) {  // set the Axis at the specified slot in the Graph.
        this.AxisStorage[slot] = Axis;
    }
    addAllAxis(metadata) {
        for (const axisName of metadata.axes ?? [])
        {
            this.addNewAxis({
                name: axisName
            });
        }
    }

    addNewAxis(extras) {  
        const newAxis = new Axis ("Thing.Axis", extras.name, {},{  });
        const slot = this.AxisStorage.push(newAxis) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(newAxis, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removeAxis(slot) {  // remove the Axis at the specified slot in the Graph.
        this.AxisStorage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }


    findThing (fieldName, value) {
        // search for a thing in the Graph that matches the criteria, and return its location.
        const index= this.indexes.get(fieldName ?? "id")
        const slot = index.findSlotByKey(value);
        return this.AxisStorage[slot];
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

    static selfTestCreate (metadata) {
        let testobj = new Graph (metadata.subRoles)
        console.log ("created new Graph", testObj)
    }
}

