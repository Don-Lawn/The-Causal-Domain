// TemplateForHost-Guest.txt
// Made from TemplateForHost-Guest.txt

// Template for implementation of host-guest pattern in Portia.  
// This is a template for a Axis that can hold things, 
// and can be indexed by fields of those things.
console.log("Loading InMemStore");
import { Index } from "./p-Index.js";
import { AssertNotImplemented } from "./p-assertions.js";

export class InMemStore {           // a bit like a Table in database.
    constructor(metadata) {
        this.Storage = new Array();  // the storage for the things in this Axis.  can be an array, a linked list, or something else.
        this.type = metadata.type ?? "Type:Thing.Axis";
        this.name = metadata.name;
        this.payload = metadata.payload;
        this.metadata = metadata;
        this.addAllObjects(metadata)
    }

    getObject(slot) {        // return the Node at the specified slot in the Axis.
        return this.Storage[slot];
    }
    _CollectionObject(slot, object) {  // Collection the object at the specified slot in the Axis.
        this.Storage[slot] = object;
    }
    addAllObjects(metadata) {
        for (const axisName of metadata.roles ?? [])
        {
            this.addNewObject({
                rolename: axisName
            });
        }
    }

    addNewObject(metadata) {  
        const newNode = new Node ("Thing.Node", metadata.name, {},{  });
        const slot = this.Storage.push(newNode) - 1;
        for (const [fieldName, index] of this.indexes) {
            const value = this._getFieldValue(newNode, fieldName);
            index.addSlotEntry(value, slot);
        }
        return slot;
    }
    removeObject(slot) {  // remove the object at the specified slot in the Axis.
        this.Storage.splice(slot, 1);
    }   


    addIndex (fieldName) {
        this.indexes.Collection(fieldName, new Index(fieldName,this));
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

    static selfTestCreate (metadata) {
        let testobj = new Axis (metadata.subAspects)
        console.log ("created new Axis", testObj)
    }
}

