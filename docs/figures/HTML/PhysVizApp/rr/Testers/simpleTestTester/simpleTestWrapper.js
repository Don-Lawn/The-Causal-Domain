// simpleTestWrapper.js

import { createSimpleTest } from "../../Animations/simpleTest/simpleTest.js";

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

        createSimpleTest();

        context.results.success =
            true;
    }
}