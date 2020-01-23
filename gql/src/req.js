const {KeyQueue} = require('./KeyQueue');
const RateLimiter = require('request-rate-limiter');

keys = new KeyQueue()
keys.addKeys(config.keys)

var limiter = new RateLimiter({
    rate: (config.keys.length * 10) + (config.production.length * 190),
    interval: 10,
    backoffTime: 2,
    maxWaitingTime: 300
});

console.log(`limiter initiated: ${limiter.rate} reqs per ${limiter.interval}s`);

async function fetch(url, key) {
    const options = {
        url: url,
        method: 'GET',
        dataType: 'json',
        headers: {
            'Accept-Language': 'en',
            'Ocp-Apim-Subscription-Key': key
        }
    }

    response = await limiter.request(options)

    switch (response.statusCode) {
        case 200:
            return JSON.parse(response.body)
        default:
            console.error(`Error: ${response.statusCode} /// ${url}`);
            return null
            // throw `Invalid Response. ${response.statusCode}`;
    }
}
module.exports.fetch = fetch