// simpleTestWrapper.js

import {
    run
}
from "../../Animations/simpleTest/simpleTest.js";

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