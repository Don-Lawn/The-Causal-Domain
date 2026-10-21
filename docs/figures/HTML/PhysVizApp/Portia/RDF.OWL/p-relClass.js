// p-relClass.js
import { Class } from "./p-Class.js";
import { RelEnd } from "./p-RelEnd.js";
export class RelClass extends Class
{
    constructor(id, name, stereotype, domain,  range, owl)
    {
        super(id, name, stereotype ??"RDF.RelClass");
        this.domainEnd = new RelEnd (domain);    // aka as domain
        this.rangeEnd = new RelEnd (range);        // aka as range
        this.transitive = owl?.transitive  ?? false
        this.symmetric = owl?.symmetric  ?? false
        this.reflexive = owl?.reflexive  ?? false
        this.attachClasses (domain, range);
    }

    attachClasses(domainClass, rangeClass) {
        this.domainClass = domainClass;
        this.rangeClass = rangeClass;
    }

}
