// p-Registry.js
console.log("Loading Registry");
import { AssertNotNull } from "./p-assertions.js";
import { JsonFile } from "./p-FileJson.js";
import { PropertySet } from "./p-propertySet.js";

export class Registry {

    static initialise() {

        if (Registry.initialised) {
            return;
        }

        Registry.classToCode = Registry.load("./Metadata/metadata.factory.map.classToCode.json");

        Registry.typeToInstructions = Registry.load("./Metadata/metadata.factory.map.typeToInstructions.json");

        Registry.initialised = true;
    }

    static load(fileName) {
        const file = new JsonFile(fileName);
        const myText = file.readText(fileName);
        return file.deserialise(myText);
    }

    static loadType(type) {
        const instructionsFileName = this.getInstructions(type);
        AssertNotNull (instructionsFileName, `Registry - No file of instructions found for type: ${type}
            in file "./Metadata/metadata.factory.Map.typeToInstructions.json"`);
        const data = Registry.load(instructionsFileName);
        const asPS = new PropertySet(data);
        asPS.resolveCapabilities();
        return asPS;
    }

    static getFile(part) {
        return this.classToCode[part];
    }

    static getInstructions(type) {
        return this.typeToInstructions[type];
    }
    
    static getInstructionsAsPS(type) {
        return this.loadType(type);
    }
}