// ps-Thing.Code.js
import { Thing } from "./ps-Thing.js";
import { IdRef } from "./ps-Container.js";

export class Code extends Thing{
    constructor(name, payload, extras) {
        super("Type:Thing.Code", name, payload, extras);

        // If there is a parentRef specifiedin extras,  
        // then we add a referencetothat parent to this Code object.
        if (extras && extras.ParentRef) {
            this.parentRef = extras.ParentRef;
        }
    }
}
