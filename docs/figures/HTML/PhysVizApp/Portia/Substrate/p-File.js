// ps-FileHandler.js

import fs from 'fs';

export class File
{
    constructor (filename) {
        this.filename = filename;
    }

    getCurrentWorkingDirectory() {
        return process.cwd();
    }
    
    readText() {
        return fs.readFileSync(this.filename, 'utf8');
    }

    writeText(content) {
        fs.writeFileSync(this.filename, content, 'utf8');
    }

}


