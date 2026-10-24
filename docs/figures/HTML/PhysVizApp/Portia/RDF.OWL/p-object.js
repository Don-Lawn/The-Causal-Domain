// p-object.js

import { AssertNotNull } from "../p-assertions.js";
import { Container } from "../p-container.js";
import { Thing } from "../p-thing.js";

export class Object extends Thing
{
    constructor(id, name, itsClass)
    {
        super(id, name, "RDF.Object");
        this.itsClassIdentity = itsClass.identity;
    }

    declareThis() {
        console.log (this.identity.stereotype + " " + this.itsClassIdentity.name + " " + this.identity.name )
    }
}