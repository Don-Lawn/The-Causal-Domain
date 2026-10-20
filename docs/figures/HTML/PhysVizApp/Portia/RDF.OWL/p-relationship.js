// p-relationship.js

import { Object } from "./p-Object.js";
import { RelEnd } from "./p-relEnd.js";

export class Relationship extends Object
{
    constructor(id, name, stereotype, className, fromEnd,  toEnd)
    {
        super(id, name, stereotype, className);
        this.fromEnd = new RelEnd (fromEnd);
        this.toEnd = new RelEnd (toEnd);
    }

    
    attachObjects(fromObject, toObject) {
        this.fromObject = fromObject;
        this.toObject = toObject;
    }
}