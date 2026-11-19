// ps-File.js
console.log ("Loading File");
import fs from 'fs';

export  class File
{
    constructor (fileName) {
        this.fileName = fileName;
    }

    getCurrentWorkingDirectory() {
        return process.cwd();
    }
    
    readText() {
        return fs.readFileSync(this.fileName, 'utf8');
    }

    writeText(content) {
        fs.writeFileSync(this.fileName, content, 'utf8');
    }

}


