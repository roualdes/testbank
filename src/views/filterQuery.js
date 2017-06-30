/*
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';


function filterQuery(problem, qtree) {
  /* TODO allow case insensitive searching */

  let match = true;

  /* Determine type of search to make */
  let match_left = true,
      match_right = true;

  if ("left" in qtree) {
    if ("op" in qtree["left"]) {

      match_left = filterQuery(problem, qtree["left"]);

    } else {

      const lText = qtree["left"]["text"];

      if ("category" in qtree["left"]) {

          match_left = searchCategory(lText["text"], problem,
                                      qtree["left"]["category"]["text"]);

      } else {

        match_left = searchCategory(lText, problem);

      }
    }
  }


  if ("right" in qtree) {
    if ("op" in qtree["right"]) {

      match_right = filterQuery(problem, qtree["right"]);

    } else {

      const rText = qtree["right"]["text"];

      if ("category" in qtree["right"]) {

        match_right = searchCategory(rText["text"], problem,
                                     qtree["right"]["category"]["text"]);

      } else {

        match_right = searchCategory(rText, problem);
      }
    }
  }

  if ("op" in qtree) {

    switch (qtree["op"]) {
      case "OR":

        match = match_left || match_right;
        break;

      case "AND":

        match = match_left && match_right;
        break;
    }

  } else if ("text" in qtree){

    if ("category" in qtree) {

      match = searchCategory(qtree["text"]["text"], problem, qtree["category"]["text"]);

    } else {

      match = searchCategory(qtree["text"], problem, "all");

    }
  }

  return match;

};

function searchCategory(text, data, category="all") {

  let match = false;
  if (category === "all") {
    category = ["question", "answer", "author", "id", "k"]
  } else {
    category = [category];
  }

  for (let ctg of category) {
    const m = ctg in data ? searchString(data[ctg], text) : false;
    match = match || m;

    if (match) {
      break;
    }
  }

  return match;
};

function searchString(base, query) {
  return base.indexOf(query) > -1;
};

export default filterQuery;
