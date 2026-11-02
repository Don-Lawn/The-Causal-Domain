// ps-Thing.js
import { Identity } from "./ps-Identity.js";

export class Thing {
    constructor(type, name, payload,extras) {
        this.identity = new Identity(type, name, extras);
        this.payload = payload;
}
}
