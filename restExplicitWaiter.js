function waitForStatement(cb, timeOut = 3 * 60 * 1000, interval = 100) {
    log.info(`Waiting for statement ${cb.toString()}...`);
    let currentTime = () => +(new Date()),
        startTime = currentTime(),
        continuePolling = () => (currentTime() - startTime) < timeOut,
        callback = () => Promise.resolve().then(cb);
    return _pollRest(callback, continuePolling, interval, false);
}

function waitForRest(callback, timeOut = 60 * 1000, interval = 2 * 1000) {
    let currentTime = () => +(new Date()),
        startTime = currentTime(),
        continuePolling = () => (currentTime() - startTime) < timeOut;
    return _pollRest(callback, continuePolling, interval, undefined)
}

function retryRest(callback, retryNumber = 2, interval = 2 * 1000) {
    let continuePolling = () => retryNumber--;
    return _pollRest(callback, continuePolling, interval, undefined)
}

function _pollRest(callback, continuePolling, interval, cbContinueCondition) {
    return !continuePolling() ? Promise.reject(`Polling didn't give results.`) :
        callback()
            .then(response => {
                if (response !== cbContinueCondition) return response;
                return _sleep(interval)
                    .then(_ => _pollRest(callback, continuePolling, interval, cbContinueCondition));
            });
}

function _sleep(ms) {
    if (typeof ms !== 'number') throw new Error('No argument was given to _sleep');
    return new Promise(resolve => setTimeout(resolve, ms));
}
