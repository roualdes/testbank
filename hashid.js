// adapted from
// https://gist.github.com/fiznool/73ee9c7a11d1ff80b81c

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHABET_LENGTH = ALPHABET.length;
const ID_LENGTH = 4;
const UNIQUE_RETRIES = 9999;
const HashID = {};

HashID.generate = function generate() {
  let rtn = '';
  for (let i = 0; i < ID_LENGTH; i += 1) {
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
HashID.gen = function generateUnique(previous) {
  const prev = previous || [];
  let retries = 0;
  let id;

  // Try to generate an ID, that isn't in previous.
  while (!id && retries < UNIQUE_RETRIES) {
    id = HashID.generate();
    if (prev.indexOf(id) !== -1) {
      id = null;
      retries += 1;
    }
  }

  return id;
};

module.exports = HashID;
