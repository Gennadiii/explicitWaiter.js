Wrapper on Explicit waiter. It is a prototytpe of ElementFinder which means that this method chains element.
Accepts explicit wait time as a parameter.
It sets Implicit wait to 0, waits for time given explicitly and sets implicit wait time back to default.
Throws exception if no time specified.
Returns ElementFinder which makes it chainable or throws exception in case no element found.

Usage:
Add `require('./waitReady.js');` in your onPrepare block or file.

@example
element(by.xpath(`//*[@name='q']`)).waitReady(5000).click();
