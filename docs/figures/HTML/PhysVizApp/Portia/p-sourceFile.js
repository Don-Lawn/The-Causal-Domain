// p-JSsourceFile.js
import fs from 'fs/promises';import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

export class SourceFile 
{
    constructor(path, className ) {
        this.sourceFilePath = path;
        this.className = className;
    }

    async LoadSource () {    
        // Step 1: Resolve full path to class file
        const moduleUrl = pathToFileURL(this.sourceFilePath);

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
                `Class ${this.className} not found in ${this.sourceFilePath}`
            );
        }
    }


    async createObject(params) {

        if (!this.module) {
            await this.LoadSource();
        }

        return new this.module[this.className](params);
    }
}