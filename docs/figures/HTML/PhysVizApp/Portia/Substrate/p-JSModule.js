// p-JSModule.js
import { pathToFileURL } from 'url';
import { File } from './p-File.js';

export class JSModule extends File
{
    constructor(filePath, className) {
        super(filePath);
        this.className = className;
    }

    async load () {    
        // Step 1: Resolve full path to class file
        const moduleUrl = pathToFileURL(this.fileName);

        // console.log(moduleUrl.href);

        // Step 2: Dynamically import the class
        if (!this.module) {
            try {

                console.log("Loading:", moduleUrl.href);

                this.module = await import(moduleUrl.href);

                console.log(
                    "Loaded exports:",
                    Object.keys(this.module)
                );

            }
            catch (err) {

                console.error(
                    "Failed loading module:",
                    moduleUrl.href
                );

                console.error(
                    "Message:",
                    err.message
                );
            }
        }
        
        // Step 3: Ensure default export is a class
        if (typeof this.module[this.className] !== 'function') {
            throw new Error(
                `Class ${this.className} not found in ${this.filePath}`
            );
        }
    }


    async createObject(params) {

        if (!this.module) {
            await this.load();
        }

        return new this.module[this.className](params);
    }
}