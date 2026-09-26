// p-eventRecorder.js

export class EventRecorder
{
    constructor()
    {
        this.text = "";
    }

    append(
        line
    )
    {
        this.text += line + "\n";

        console.log(line);
    }

    getText()
    {
        return this.text;
    }

    clear()
    {
        this.text = "";
    }
}
``