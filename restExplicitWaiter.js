function waitForStatement = function (cb, timeOut, interval) {
    log.info(`Waiting for statement ${cb.toString()}...`);
    timeOut = timeOut || 3 * 60 * 1000;
    interval = interval || 100;
    let currentTime = () => +(new Date()),
        startTime = currentTime(),
        continuePolling = () => (currentTime() - startTime) < timeOut,
        callback = () => Promise.resolve().then(cb);
    return _pollRest(callback, continuePolling, interval, false);
};

function waitForRest(callback, timeOut, interval) {
    timeOut = timeOut || 60 * 1000;
    interval = interval || 2 * 1000;
    let currentTime = () => +(new Date()),
        startTime = currentTime(),
        continuePolling = () => (currentTime() - startTime) < timeOut;
    return _pollRest(callback, continuePolling, interval, undefined)
}

function retryRest(callback, retryNumber, interval) {
    retryNumber = retryNumber || 2;
    interval = interval || 2 * 1000;
    let continuePolling = () => retryNumber--;
    return _pollRest(callback, continuePolling, interval, undefined)
}

function _pollRest(callback, continuePolling, interval, cbContinueCondition) {
    return !continuePolling() ? Promise.reject(`Polling didn't give results.`) :
        callback()
            .then(response => response !== cbContinueCondition ? response : 
                  _sleep(interval)
                    .then(() => _pollRest(callback, continuePolling, interval, cbContinueCondition)))
}

function _sleep = function (ms) {
    if (typeof ms !== 'number') throw new Error('No argument was given to delayActivity');
    return new Promise(resolve => setTimeout(resolve, ms));
};
