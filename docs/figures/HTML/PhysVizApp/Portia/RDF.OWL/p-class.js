// p-class.js

import { Thing } from "../p-thing.js";

export class Class extends Thing
{
    constructor(id, name, stereotype) {
        super(id, name, stereotype ?? "RDF.Class");
        // otherwise, trivial override??
    }
}