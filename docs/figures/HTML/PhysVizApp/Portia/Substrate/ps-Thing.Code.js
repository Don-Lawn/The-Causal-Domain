// ps-Thing.Code.js
import { Thing } from "./ps-Thing.js";
import { IdRef } from "./ps-Container.js";

export class Code extends Thing{
    constructor(groupId, name, payload) {
        super("Code", name, payload);
        this.codeGroupRef = new IdRef(this.identity, {"GroupId": groupId});
    }
}
