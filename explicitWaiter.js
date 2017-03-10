const implicitWaitTime = 3000,
    ElementFinder = $('').constructor;


function _setImplicitWaitTime(time) {
    browser.manage().timeouts().implicitlyWait(time);
}

function _throwNoElementFoundError(element) {
    throw new Error(`WaitReady expected element \
${element.locator().toString()} to be present and visible.`)
}

function _timeNotSpecified() {
    throw new Error(`waitReady didn't get obligatory wait time argument`)
}

function _waitForElementToBePresentAndDisplayed(element, explicitWaitTime) {
    return browser.wait(function () {
        return element.isPresent()
            .then(present => !present ? false : element.isDisplayed())
            .then(displayed => displayed);
    }, explicitWaitTime)
}

function explicitlyWait(element, explicitWaitTime) {
    _setImplicitWaitTime(0);
    return waitForElementToBePresentAndDisplayed(element, explicitWaitTime)
        .then(present => {
            setTimeout(() => _setImplicitWaitTime(implicitWaitTime), 1);
            return true;
        })
        .catch(missing => {
            _setImplicitWaitTime(implicitWaitTime);
            return false;
        })
}

ElementFinder.prototype.waitReady = function (explicitWaitTime) {
    let explicitWaitTime = explicitWaitTime || _timeNotSpecified();
    explicitlyWait(this, explicitWaitTime)
        .then(elementIsVisible => {
            if (!elementIsVisible) _throwNoElementFoundError(this);
        });
    return this;
};
