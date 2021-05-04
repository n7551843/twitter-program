const { count, Console } = require('console');
const express = require('express');
const app = express();
const https = require('https');
const config = require('dotenv').config();
const needle = require('needle');
const TweetProcessor = require('./TweetProcessor.js');
const Rules = require('./Rules.js');
const TOKEN = process.env.twitter_bearer_token;
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

var counterStore = [];
var cashtagCount = 0;
var errorCount = 0;
var runCount = 0;

    // 2 set up counter function
    async function storeCount () {
        console.log("storeCount starts")
        var date = new Date();
        var obj = { 
            date:date,
            cashtagCount:cashtagCount,
            errorCount:errorCount
        };
        counterStore.push(obj);
        cashtagCount = 0;
        errorCount = 0;
        runCount = runCount + 1;
        setTimeout(storeCount, 120000);
    }

function streamTweets() {

    var currentSearchTerm = Rules.getSearchTerm();
    // 1
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    });

    // 2
    stream.on('data', (data) => {
        try {
            const json = JSON.parse(data);
            const text = json.data.text;
            var cashTag = TweetProcessor.detectCashtag(text, currentSearchTerm);
            if (cashTag) {
                cashtagCount = cashtagCount + 1;;
            };
        } catch (error) {
            errorCount = errorCount + 1;
        } 
    });
}

//Run
(async () => {
    let currentRules;
    try {

        Rules.setSearchTerm('ANKR');

        //Get all stream rules
        currentRules = await Rules.getRules();

        // Delete All stream rules
        await Rules.deleteRules(currentRules);

        // Set rules based on array above.
        await Rules.setRules();
    } catch (error) {
        console.error(error);
        // process.exit(1);
    }

    streamTweets();
    storeCount();
})()






// app.get('/', (req, res) => {
//     res.send("Hello World");
// });

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });