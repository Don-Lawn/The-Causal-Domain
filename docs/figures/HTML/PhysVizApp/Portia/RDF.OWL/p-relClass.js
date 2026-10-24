// p-relClass.js
import { Class } from "./p-class.js";
export class RelClass extends Class
{
    constructor(id, name, domain,  range, owl)
    {
        super(id, name, "RDF.RelClass");
        this.owl = owl;
        this.attachClasses(domain, range);
    }

    attachClasses(domain,range) {
        this.domain = domain;
        this.range = range;
    }
    
    declareThis() {
        console.log (
            this.domain.roleName + " " + 
            this.domain.class.identity.name + " " + 
            this.identity.name + " " + 
            this.range.roleName + " " + 
            this.range.class.identity.name 
        );
    }
}

