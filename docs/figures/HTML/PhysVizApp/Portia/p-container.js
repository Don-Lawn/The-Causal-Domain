// p-Container.js
import  { Thing } from "./p-thing.js";

export class Container extends Thing {
    constructor(id, name, stereotype) {
        super(id, name, stereotype ?? "Container");
        this.thingsById = new Map();
        this.thingsByName = new Map();
    }

    addThing(thing) {
        // Implementation for adding this container to another container
        this.thingsById.set(thing.identity.id, thing);
        this.thingsByName.set(thing.identity.name, thing);
        thing.attachToContainer(this);  // Attach the thing to this container
    }
    getThingById(id) {
        return this.thingsById.get(id);
    }
    getThingByName(name) {
        return this.thingsByName.get(name);
    }
}
