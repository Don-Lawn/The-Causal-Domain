// ps-Thing.js
import { Identity } from "./ps-Identity.js";
import { Index } from "./ps-Index.js";  

export class Thing {
    constructor(metadata) {
        this.identity = new Identity(metadata.type, metadata.name);
        this.payload = metadata.payload;
        this.usageCount = 0;
        this.indexes = new Map();  // map of field names to indexes for those fields in the container.
        this.indexIdentityFields()
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
