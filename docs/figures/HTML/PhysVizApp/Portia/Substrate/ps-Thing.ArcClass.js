// ps-ArcClass.js
import { Thing } from "./ps-Thing.js";

export class ArcClass extends Thing{
    constructor(groupId, name, payload) {
        super("ArcClass", name, payload);
    }
}
