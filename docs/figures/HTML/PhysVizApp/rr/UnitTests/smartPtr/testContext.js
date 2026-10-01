// pv-testContext.js

export class TestContext
{
    constructor()
    {
        this.master = null;
        this.domains = [];
        this.objects = [];
        this.results = {};
        this.errors = [];
        this.log = [];
    }
}