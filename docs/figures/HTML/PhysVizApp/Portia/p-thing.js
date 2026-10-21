// p-thing.js
import { AssertNotNull } from "./p-assertions.js";

export class Thing
{
    constructor(id, name, stereotype)
    {
        this.id = id ??crypto.randomUUID();
        AssertNotNull(name, "Thing.constructor", "Name must not be null or undefined");
        AssertNotNull(stereotype, "Thing.constructor", "Stereotype must not be null or undefined");
        this.name = name;
        this.stereotype = stereotype;
    }

    attachToContainer(cont) {
        this.cont = cont;
    }
}