import { SimpleTestTester } from "../simpleTestTester/simpleTestTester.js";

const testBtn =
    document.getElementById(
        "testBtn"
    );

if (testBtn)
{
    testBtn.addEventListener(
        "click",
        function ()
        {
            const tester =
                new SimpleTestTester();

            tester.execute();
        }
    );
}