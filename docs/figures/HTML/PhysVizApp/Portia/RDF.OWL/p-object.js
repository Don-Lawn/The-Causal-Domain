// p-object.js

import { Thing } from "../p-thing.js";

export class Object extends Thing
{
    constructor(id, name, stereotype, className)
    {
        super(id, name, stereotype);
        this.className = className;
    }

    addToGraph(graph) {
        // Implementation for adding this object to the graph
        graph.add(this);
    }   
    
}