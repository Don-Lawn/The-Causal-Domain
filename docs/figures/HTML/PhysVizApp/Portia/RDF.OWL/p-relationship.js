// p-relationship.js

import { Object } from "./p-Object.js";


export class Relationship extends Object
{
    constructor(id, name, stereotype, itsClass, fromObject, toObject)
    {
        super(id, name, stereotype ?? "RDF.Relationship", itsClass, fromObject, toObject);
        this.attachObjects(fromObject, toObject);
    }

    
    attachObjects(fromObject, toObject) {
        this.fromObjectId = fromObject.id;
        this.toObjectId = toObject.id;
    }
}