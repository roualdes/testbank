/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

function searchCategory(text, data, category = 'all') {
  let ctgry;
  if (category === 'all') {
    ctgry = ['question', 'answer', 'author', 'id', 'k'];
  } else {
    ctgry = [category];
  }

  const match = ctgry.some(ctg => (ctg in data ?
                                   data[ctg].indexOf(text) > -1 :
                                   false));

  return match;
}


function filterQuery(problem, qtree) {
  /* TODO allow case insensitive searching */

  let match = true;

  /* Determine type of search to make */
  let matchLeft = true;
  let matchRight = true;

  if ('left' in qtree) {
    if ('op' in qtree.left) {
      matchLeft = filterQuery(problem, qtree.left);
    } else {
      const lText = qtree.left.text;

      if ('category' in qtree.left) {
        matchLeft = searchCategory(lText.text, problem,
                                   qtree.left.category.text);
      } else {
        matchLeft = searchCategory(lText, problem);
      }
    }
  }


  if ('right' in qtree) {
    if ('op' in qtree.right) {
      matchRight = filterQuery(problem, qtree.right);
    } else {
      const rText = qtree.right.text;

      if ('category' in qtree.right) {
        matchRight = searchCategory(rText.text, problem,
                                    qtree.right.category.text);
      } else {
        matchRight = searchCategory(rText, problem);
      }
    }
  }

  if ('op' in qtree) {
    switch (qtree.op) {
      case 'OR':
        match = matchLeft || matchRight;
        break;

      case 'AND':
        match = matchLeft && matchRight;
        break;

      default:
        break;
    }
  } else if ('text' in qtree) {
    if ('category' in qtree) {
      match = searchCategory(qtree.text.text, problem, qtree.category.text);
    } else {
      match = searchCategory(qtree.text, problem, 'all');
    }
  }

  return match;
}


export default filterQuery;
