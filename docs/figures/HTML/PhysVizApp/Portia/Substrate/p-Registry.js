// p-Registry.js
console.log("Loading Registry");
import { JsonFile } from "./p-FileJson.js";
export class Registry {

    static initialise() {

        if (Registry.initialised) {
            return;
        }

        Registry.classToCode = Registry.load("./metadata/metadata.factory.map.classToCode.json");

        Registry.typeToInstructions = Registry.load("./metadata/metadata.factory.map.typeToInstructions.json");

        Registry.initialised = true;
    }

    static load(fileName) {
        const file = new JsonFile(fileName);
        return file.deserialise(file.readText());
    }

    static getFile(part) {
        return Registry.classToCode[part];
    }

    static getInstructions(type) {
        return Registry.typeToInstructions[type];
    }
}