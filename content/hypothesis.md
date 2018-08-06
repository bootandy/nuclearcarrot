+++
title = "Hypothesis is shit"
date = 2018-08-06
+++

## Hypothesis is shit
[Hypothesis](https://hypothesis.works/) & property based testing are some of the new darlings of modern development. Many people love them. I do not. In fact I despise Hypothesis. Or perhaps I should say, I despise the way people use Hypothesis, treating it like it is a unittest framework when it isn’t.

Let me explain why. Here is a pattern I have followed many times:
* Check in code
* Tests Pass
* Build Fails! Can not merge!
* Check build -> A random hypothesis test that is nothing to do with my code has failed.

## Now what?
Sometimes Hypothesis has taken too long to build strategies and I need to add another commit simplifying the hypothesis test.
Sometimes a test has failed. Is it a real failure? I don’t know, I have never worked on that area of the code. The correct thing to do is to raise a ticket, but we all know that usually people just click ‘retry’ on the CI server.

But the point is I shouldn’t have to do _any_ of that. Hypothesis shouldn’t interrupt my workflow. Hypothesis is bad because it breaks the rules of unittesting.

## Rules of Testing:
Let us examine the unit test FIRST rules that are defined in the book Clean Code written by Uncle Bob Martin.

* Fast: Tests should be fast:
  * Fail: With hypothesis strategies your test will not be fast.
* Independent: Tests should not depend on the state of the previous test
  * Pass
* Repeatable: Tests should be repeatable in any environment without varying results.
  * Fail. The very definition of Hypothesis makes tests unrepeatable.
* Self-validating: Each test will have a single boolean output of pass or fail.
  * Pass
* Timely: Unit tests should be written just before the production code
  * Pass (Irrelevant)


I once attended a talk by the creator of hypothesis [DRMacIver](https://github.com/DRMacIver), he is definitely a smart guy and I directly asked him why we should use hypothesis when it seems to break so many rules of unit testing. His answer was that different people have different ideas of what constitutes a unit test. It is an interesting answer, but I think it is wrong.

Despite all this I feel there is a place somewhere for Hypothesis. A separate build that is allowed to fail following the ‘push on yellow’ philosophy of google. Hypothesis is great at finding edge cases.

But please for the sake of your sanity and mine don’t use Hypothesis in unit tests. Ever.
