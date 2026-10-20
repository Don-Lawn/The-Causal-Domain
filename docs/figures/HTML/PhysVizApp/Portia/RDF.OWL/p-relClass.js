// p-relClass.js
import { Class } from "./p-Class.js";
import { RelEnd } from "./p-relEnd.js";
export class RelClass extends Class
{
    constructor(id, name, stereotype, fromEnd,  toEnd, owl)
    {
        super(id, name, stereotype);
        this.fromEnd = new RelEnd (fromEnd);    // aka as domain
        this.toEnd = new RelEnd (toEnd);        // aka as range
        this.transitive = owl?.transitive  ?? false
        this.symmetric = owl?.symmetric  ?? false
        this.reflexive = owl?.reflexive  ?? false
    }

    attachClasses(fromClass, toClass) {
        this.fromClass = fromClass;
        this.toClass = toClass;
    }

}
