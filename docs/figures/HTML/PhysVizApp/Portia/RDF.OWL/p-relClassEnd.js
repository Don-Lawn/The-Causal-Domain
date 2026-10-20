// p-relEnd.js


export class relEnd 
{
    constructor(navigable, multiplicity, aggregation, roleName) {
        this.navigable = navigable ?? true;  //  means "not navigable"
        this.multiplicity = multiplicity ?? -1;  //  means "many"
        this.aggregation = aggregation ?? "none";  //  means "none" from (none, aggregate, composite)
        this.roleName = roleName ?? "";
    }
}
