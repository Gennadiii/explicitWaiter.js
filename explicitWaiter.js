// Notice that webdriver does not provide implicitWait getter, you can only set it.
// As a solution we could set implicit wait param into browser.params - https://github.com/angular/protractor/blob/master/lib/config.ts#L454
const implicitWaitTime = browser.params.implicitWaitTimeout || 0;

/**
 * 
 * Works like original webdriverjs wait function. 
 * Except it will set implicit wait timeout to 0 before and
 * will set it back to your browser.params.implicitWaitTimeout after wait will be finished
 * 
 * @throws same expections as original browser.wait would throw
 * 
 * @param {Function} predicate Predicate function (returns only true/false, no exceptions).
 * This parameter is compatible with ExpectedConditions, so you could pass any of it, 
 * or create own condition
 * 
 * @param {number} timeout Optional parameter, timeout in ms, how long to wait until throw TimeoutError. 
 * If not set - will wait forever (same logic as protractor do)
 * 
 * @param {string} message Optional message that will be used in case wait was unsucessful.
 * 
 * @returns webdriver.promise.Promise that will be resolved/rejected when wait was finished.
 */
browser.explWait = function (predicate, timeout, message) {
    return browser.manage().timeouts().implicitlyWait(0).then(()=> {
        return browser.wait(predicate, timeout, message)
            .then(undefined,
                (err)=> {
                    browser.manage().timeouts().implicitlyWait(implicitWaitTime)
                    throw err
                }
            )
    })
}
