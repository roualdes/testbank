// adapted from
// https://gist.github.com/fiznool/73ee9c7a11d1ff80b81c

'use strict';

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LENGTH = ALPHABET.length;
const ID_LENGTH = 4;
const UNIQUE_RETRIES = 9999;
var HashID = {};


HashID.generate = function() {
  var rtn = '';
  for (var i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET_LENGTH));
  }
  return rtn;
};

/**
 * Tries to generate a unique ID that is not defined in the
 * `previous` array.
 * @param  {Array} previous The list of previous ids to avoid.
 * @return {String} A unique ID, or `null` if one could not be generated.
 */
HashID.generateUnique = function(previous) {
  previous = previous || [];
  var retries = 0;
  var id;

  // Try to generate an ID, that isn't in previous.
  while(!id && retries < UNIQUE_RETRIES) {
    id = HashID.generate();
    if(previous.indexOf(id) !== -1) {
      id = null;
      retries++;
    }
  }

  return id;
};

module.exports = HashID;
