// p-Registry.js
console.log("Loading Registry");
import { JsonFile } from "./p-FileJson.js";
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

    static getFile(part) {
        return Registry.classToCode[part];
    }

    static getInstructions(type) {
        return Registry.typeToInstructions[type];
    }
}