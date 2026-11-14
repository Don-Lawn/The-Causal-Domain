//p-Arc.js

import { Thing } from "./p-Thing.js";

export class Arc extends Thing {
    constructor(Host, Target, Role) {
        super();
        this.Host = Host;
        this.Target = Target;
        this.Role = Role;
    }
}
    