// p-thing.js
import { AssertNotNull } from "./p-assertions.js";

export class Thing
{
    constructor(id, name, stereotype)
    {
        AssertNotNull(name, "Thing.constructor", "Name must not be null or undefined");
        AssertNotNull(stereotype, "Thing.constructor", "Stereotype must not be null or undefined");
        this.id = id ??crypto.randomUUID();
        this.name = name;
        this.stereotype = stereotype;
    }               

}