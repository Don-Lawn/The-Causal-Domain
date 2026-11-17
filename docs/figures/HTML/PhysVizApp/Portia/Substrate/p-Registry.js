// p-Registry.js
import { JsonFile } from "./p-FileJson.js";
export class Registry {

    static initialise() {

        if (Registry.initialised) {
            return;
        }

        Registry.typeToFile = Registry.load("./metadata/metadata.factory.map.typeToFile.json");

        Registry.typeToInstructions = Registry.load("./metadata/metadata.factory.map.typeToInstructions.json");

        Registry.initialised = true;
    }

    static load(fileName) {
        const file = new JsonFile(fileName);
        return file.deserialise(file.readText());
    }

    static getFile(type) {
        return Registry.typeToFile[type];
    }

    static getInstructions(type) {
        return Registry.typeToInstructions[type];
    }
}