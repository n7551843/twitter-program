const config = require('dotenv').config();
const needle = require('needle');
const TOKEN = process.env.twitter_bearer_token;
const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

var searchTerm = 'UNI';
var rules = [{
    value: `${searchTerm}`
}];

module.exports = {
    getSearchTerm: function () {
        return searchTerm;
    },
    setSearchTerm: function (newTerm) {
        searchTerm = newTerm;
        rules = [{
            value: `${newTerm}`
        }];
        console.log(`new rules set with term ${newTerm}`);
    },
    setRules: async function () {
        const data = {
            add: rules
        }
        const response = await needle('post', rulesURL, data, {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${TOKEN}`
            }
        });
        console.log("**** setRules returns ****");
        // console.log(response.body);
        return response.body;
    },
    getRules: async function () {
        const response = await needle('get', rulesURL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });
        console.log("**** getRules returns ****");
        return response.body;
    },
    deleteRules: async function (rules) {
        if (!Array.isArray(rules.data)) {
            return null;
        }
        const ids = rules.data.map(rule => rule.id);
        const data = {
            delete: {
                ids: ids
            }
        }
        const response = await needle('post', rulesURL, data, {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${TOKEN}`
            }
        });
        console.log("**** deleteRules returns ****");
        return response.body;
    }
  };