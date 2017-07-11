/**
 * Copyright (c) 2017-present, Edward A. Roualdes.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

function format(lits, ...substs) {
  const raw = lits.raw;
  let result = '';

  substs.forEach((subst, i) => {
    const lit = raw[i];
    let sub = subst;
    if (Array.isArray(subst)) {
      sub = sub.join('');
    }
    result += lit;
    result += sub;
  });
  result += raw[raw.length - 1];

  return result;
}

export default format;
