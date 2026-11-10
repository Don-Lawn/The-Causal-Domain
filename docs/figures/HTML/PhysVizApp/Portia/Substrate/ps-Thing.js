// ps-Thing.js
import { Identity } from "./ps-Identity.js";
import { Index } from "./ps-Index.js";  

export class Thing {
    constructor(type, name, payload,extras) {
        this.identity = new Identity(type, name, extras);
        this.payload = payload;
        this.usageCount = 0;
        this.indexes = new Map();  // map of field names to indexes for those fields in the container.
    }

    indexIdentityFields () {
        this.indexField ("identity.id");
        this.indexField ("identity.type");
        this.indexField ("identity.name");
    }

    indexField (fieldName) {
        this.indexes.set(fieldName, new Index(fieldName,this));
    }
}
