// simpleTestWrapper.js

import {
    run
}
from "./simpleTest.js";

export class SimpleTestWrapper
{
    execute(
        context,
        hints
    )
    {
        context.log.push(
            "SimpleTestWrapper.execute"
        );

        run();

        context.results.success =
            true;
    }
}