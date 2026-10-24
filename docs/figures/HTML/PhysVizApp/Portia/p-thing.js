// p-thing.js
import { AssertNotNull } from "./p-assertions.js";

export class Thing
{
    constructor(id, name, stereotype)
    {
        this.setIdentity (id, name, stereotype);
    }

    attachToContainer(container) {
        this.container = container;
    }

    setIdentity(id, name, stereotype) {
        this.identity = {};
        this.identity.id = id ?? crypto.randomUUID();
        AssertNotNull(name, "Thing.constructor", "Name must not be null or undefined");
        AssertNotNull(stereotype, "Thing.constructor", "Stereotype must not be null or undefined");
        this.identity.name = name ;
        this.identity.stereotype = stereotype ;
    }

    declareThis() {
        console.log (this.identity.stereotype + " " + this.identity.name );
    }
}