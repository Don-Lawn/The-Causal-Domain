// ps-Thing.Node.js

import { Thing } from "./ps-Thing.js";

export class Node extends Thing{
    constructor(name, payload, extras) {
        super("Node", name, payload, extras);
    }
}
