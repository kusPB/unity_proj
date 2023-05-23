//@ts-check

const emojis = require('./src/crazymoji.json');
const array = require('./src/emojis');
var emoji_array = array.emojis_array();

const titleize = require('titleize');

const Fuse = require('fuse.js')

var getKeys = function (obj) {
    var array = [];
    for (var key in obj) {
        array.push(key);
    }
    return array;
}



/**
 * Flatter/Merge a nested arrays of emojis
 * @module flatten
 * @param {Array<string>} nested_array - Nested array of category/sub_category
 * @returns {Array<string>} - Merged/Flatter array
 */

module.exports.flatten = (nested_array) => {
    return [].concat.apply([], nested_array);
}



/**
 * Get the RAW object containing all the emojis
 * @module get_raw
 * @returns {Object} - The RAW data of all the emojis
 */
module.exports.get_raw = () => {
    return emojis;
}


/**
 * Get the list of categories of emojis
 * @module categories
 * @returns {Array} string - List of emoji categories
 */

module.exports.categories = () => {
    return getKeys(emojis);

}

/**
 * Get sub-categories of emojis
 * @module sub_categories
 * @returns {Array<string>} - List of sub categories with their parent categories
 */

module.exports.sub_categories = () => {
    var sub_categories = [];
    var categories = getKeys(emojis);
    categories.forEach((elem, index) => {
        var temp = getKeys(emojis[elem]);
        sub_categories.push(temp);
    });
    return sub_categories;
}



/**
 * Filter emojis by categories
 * @module filter_by_category
 * @param {string} category - Exact emoji category name
 * @returns {object} string - List of emojis filtered by the given category
 */

module.exports.filter_by_category = (category) => {
    const data = titleize(category).replace('Github', 'GitHub');
    const categories = this.categories();
    if (categories.includes(data)) {
        return emojis[data];
    } else {
        throw new Error(`crazymoji: Category \'${data}\' not found!`);
    }
}

/**
 * Emojify an array
 * @module emojify
 * @param { Array} sub_category - The sub category
 * @returns {array} string
 */

module.exports.emojify = (sub_category) => {
    var flatten = this.flatten(sub_category);
    var text = [];
    flatten.forEach(element => {
        text.push(`:${element.trim()}:`);
    });
    return text;
}



/**
 * Matches emojis using fUZZY logic
 * @module find
 * @param {string} emoji_pattern - name (case insensitive) of the pattern
 * @returns {Array<string>} - Array of matched emojis
 */

module.exports.find = (emoji_pattern) => {
    emoji_pattern = emoji_pattern.trim();
    emoji_pattern.replace(/\s/g, '_').toLowerCase();
    var to_return = [];
    const options = {
        threshold: 0.3,
        findAllMatches: true,
        minMatchCharLength: 3
    }

    const fuse = new Fuse(emoji_array, options);
    var result = fuse.search(emoji_pattern);
    result.forEach((elem) => {
        to_return.push(`:${emoji_array[elem]}:`);
    });
    return to_return;
}



/**
 * Matches emojis using fUZZY logic
 * @module find_exact
 * @param {string} emoji_pattern - name (case insensitive) of the pattern
 * @returns {Array<string>} - Array of matched emojis
 */

module.exports.find_exact = (emoji_pattern) => {
    emoji_pattern = emoji_pattern.trim();
    emoji_pattern.replace(/\s/g, '_').toLowerCase();
    var to_return = [];
    const options = {
        threshold: 0.0,
        findAllMatches: true,
        minMatchCharLength: 3
    }

    const fuse = new Fuse(emoji_array, options);
    var result = fuse.search(emoji_pattern);
    result.forEach((elem) => {
        to_return.push(`:${emoji_array[elem]}:`);
    });
    return to_return;
}

/**
 * List down all the emojis
 * @module get_all_emojis
 * @returns {Array<string>} - List of all the emojis 
 */
module.exports.get_all_emojis = () => {
    var to_return = [];
    emoji_array.forEach((elem) => {
        to_return.push(`:${elem}:`);
    });
    return to_return;
}