// p-object.js

import { AssertNotNull } from "../p-assertions.js";
import { Container } from "../p-container.js";
import { Thing } from "../p-thing.js";

export class Object extends Thing
{
    constructor(id, name, itsClass)
    {
        super(id, name, "RDF.Object");
        this.className = itsClass.name;
        this.classId = itsClass.id;
        AssertNotNull(this.classId, "Object.constructor", `Class with name '${itsClass}' not found in container`);
        
    }

}