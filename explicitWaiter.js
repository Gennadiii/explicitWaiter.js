const implicitWaitTime = 3000,
    ElementFinder = $('').constructor;


function _setImplicitWaitTime(time) {
    browser.manage().timeouts().implicitlyWait(time);
}

function _throghTimeNotSpecified(element) {
    throw new Error(`WaitReady expected element ` + 
`${element.locator().toString()} to be present and visible.`)
}

function _timeNotSpecified() {
    throw new Error(`waitReady didn't get obligatory wait time argument`)
}

function _waitForElementToBePresentAndDisplayed(element, explicitWaitTime) {
    return browser.wait(() => {
        return element.isPresent()
            .then(present => present && element.isDisplayed());
    }, explicitWaitTime)
}

function _explicitlyWait(element, explicitWaitTime) {
    _setImplicitWaitTime(0);
    return _waitForElementToBePresentAndDisplayed(element, explicitWaitTime)
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
    explicitWaitTime = explicitWaitTime || _throghTimeNotSpecified();
    _explicitlyWait(this, explicitWaitTime)
        .then(elementIsVisible => {
            if (!elementIsVisible) _throwNoElementFoundError(this);
        });
    return this;
};
