// p-Container.js
import  { Thing } from "./p-thing.js";

export class Container extends Thing {
    constructor(id, name, stereotype) {
        super(id, name, stereotype);
        this.thingsById = new Map();
    }

    addThing(thing) {
        // Implementation for adding this container to another container
        this.thingsById.set(thing.id, thing);
    }
    fetchThing(id) {
        return this.thingsById.get(id);
    }
}
