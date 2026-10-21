// p-relEnd.js
import { Thing } from "../p-thing.js";

export class RelClassEnd extends Thing
{
    constructor(id, name, navigable, multiplicity, aggregation, roleName, owl) {
        super(id, name, "RelClassEnd");
        this.navigable = navigable ?? true;  //  means "not navigable"
        this.multiplicity = multiplicity ?? -1;  //  means "many"
        this.aggregation = aggregation ?? "none";  //  means "none" from (none, aggregate, composite)
        this.roleName = roleName ?? "anonymous";  //  means "anonymous"
        this.owl = owl ?? { symmetric:false, transitive:false, reflexive:false};
        this.targetClass=null;  //  means "not set"
    }

    attachToDomainByClassId(domainClassId) {
        this.targetClassId = domainClassId;
    } 

    attachToRangeByClassId(rangeClassId) {
        this.targetClassId = rangeClassId;
    } 
}