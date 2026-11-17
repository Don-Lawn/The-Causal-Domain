// ps-SmartFactory.js

import { JsonFile } from "./p-FileJson.js";
import { Identity } from "./p-Identity.js";
import { Aggregate } from "./p-Aggregate.js";
import { Set } from "./p-Set.js";
import { Registry } from "./p-Registry.js";
import { AssertNotNull } from "./p-assertions.js";

export class SmartFactory {
    constructor(type) {
        this.instructionsFileName = Registry.getInstructions(type);
        AssertNotNull (this.instructionsFileName, `SmartFactory - No file of instructions found for type: ${type} 
            in file "./metadata/metadata.factory.typeToInstructions.json"`);
        const fs = new JsonFile(this.instructionsFileName);
        this.instructions = fs.deserialise(fs.readText());
        AssertNotNull (this.instructions, `SmartFactory - No instructions found for type: ${type} 
            in file "./metadata/metadata.factory.typeToInstructions.json"`);
    }


    build() {
        let aggr = new Aggregate(this.instructions);
        let tmpPart = new Identity (this.metadata.identity);
        aggr.addPart("Identity", tmpPart);
        tmpPart = new Set (this.metadata);
        aggr.addPart("Parts", tmpPart);
        tmpPart = new Set (this.metadata.payload);
        aggr.addPart("Parts", tmpPart);
        return aggr;

    }
}