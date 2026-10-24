// p-relationship.js

import { Object } from "./p-Object.js";


export class Relationship extends Object
{
    constructor(id, name, itsClass, fromObject, toObject)
    {
        super(id, name, "RDF.Relationship");
        this.itsClass = itsClass;
        this.attachObjects(fromObject, toObject);
    }

    
    attachObjects(fromObject, toObject) {
        this.fromObjectIdentity = fromObject.identity;
        this.toObjectIdentity = toObject.identity;
    }

    declareThis() {
        const relClass = this.itsClass;
        console.log (
            relClass.domain.roleName + " " + 
            this.fromObjectIdentity.name + " " + 
            this.itsClass.identity.name + " " + 
            relClass.range.roleName + " " + 
            this.toObjectIdentity.name );
    }
}