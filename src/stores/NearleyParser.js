// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function() {
  function id(x) {
    return x[0];
  }
  var grammar = {
    Lexer: undefined,
    ParserRules: [
      {
        name: 'main',
        symbols: ['_', 'O', '_'],
        postprocess: function(d) {
          return d[1];
        }
      },
      {
        name: 'P',
        symbols: [{ literal: '(' }, '_', 'O', '_', { literal: ')' }],
        postprocess: function(d) {
          return d[2];
        }
      },
      { name: 'P', symbols: ['WORD'], postprocess: id },
      { name: 'P', symbols: ['dqstring'], postprocess: id },
      { name: 'P', symbols: ['sqstring'], postprocess: id },
      {
        name: 'A$string$1',
        symbols: [{ literal: 'A' }, { literal: 'N' }, { literal: 'D' }],
        postprocess: function joiner(d) {
          return d.join('');
        }
      },
      {
        name: 'A',
        symbols: ['A', '_', 'A$string$1', '_', 'P'],
        postprocess: function(d) {
          return { op: 'AND', left: d[0], right: d[4] };
        }
      },
      { name: 'A', symbols: ['P'], postprocess: id },
      {
        name: 'O$string$1',
        symbols: [{ literal: 'O' }, { literal: 'R' }],
        postprocess: function joiner(d) {
          return d.join('');
        }
      },
      {
        name: 'O',
        symbols: ['O', '_', 'O$string$1', '_', 'A'],
        postprocess: function(d) {
          return { op: 'OR', left: d[0], right: d[4] };
        }
      },
      { name: 'O', symbols: ['A'], postprocess: id },
      { name: 'WORD$ebnf$1', symbols: [/[\w]/] },
      {
        name: 'WORD$ebnf$1',
        symbols: ['WORD$ebnf$1', /[\w]/],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      },
      {
        name: 'WORD',
        symbols: ['WORD$ebnf$1'],
        postprocess: function(d) {
          return { text: d[0].join('') };
        }
      },
      { name: 'WORD', symbols: ['C'], postprocess: id },
      {
        name: 'C',
        symbols: ['WORD', '_', { literal: ':' }, '_', 'P'],
        postprocess: function(d) {
          return { category: d[0], text: d[4] };
        }
      },
      { name: 'dqstring$ebnf$1', symbols: [] },
      {
        name: 'dqstring$ebnf$1',
        symbols: ['dqstring$ebnf$1', 'dstrchar'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      },
      {
        name: 'dqstring',
        symbols: [{ literal: '"' }, 'dqstring$ebnf$1', { literal: '"' }],
        postprocess: function(d) {
          return { text: d[1].join('') };
        }
      },
      { name: 'sqstring$ebnf$1', symbols: [] },
      {
        name: 'sqstring$ebnf$1',
        symbols: ['sqstring$ebnf$1', 'sstrchar'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      },
      {
        name: 'sqstring',
        symbols: [{ literal: "'" }, 'sqstring$ebnf$1', { literal: "'" }],
        postprocess: function(d) {
          return { text: d[1].join('') };
        }
      },
      { name: 'dstrchar', symbols: [/[^\\"\n]/], postprocess: id },
      {
        name: 'dstrchar',
        symbols: [{ literal: '\\' }, 'strescape'],
        postprocess: function(d) {
          return JSON.parse('"' + d.join('') + '"');
        }
      },
      { name: 'sstrchar', symbols: [/[^\\'\n]/], postprocess: id },
      {
        name: 'sstrchar',
        symbols: [{ literal: '\\' }, 'strescape'],
        postprocess: function(d) {
          return JSON.parse('"' + d.join('') + '"');
        }
      },
      {
        name: 'sstrchar$string$1',
        symbols: [{ literal: '\\' }, { literal: "'" }],
        postprocess: function joiner(d) {
          return d.join('');
        }
      },
      {
        name: 'sstrchar',
        symbols: ['sstrchar$string$1'],
        postprocess: function(d) {
          return "'";
        }
      },
      { name: 'strescape', symbols: [/["\\\/bfnrt]/], postprocess: id },
      {
        name: 'strescape',
        symbols: [
          { literal: 'u' },
          /[a-fA-F0-9]/,
          /[a-fA-F0-9]/,
          /[a-fA-F0-9]/,
          /[a-fA-F0-9]/
        ],
        postprocess: function(d) {
          return d.join('');
        }
      },
      { name: '_$ebnf$1', symbols: [] },
      {
        name: '_$ebnf$1',
        symbols: ['_$ebnf$1', /[\s]/],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]]);
        }
      },
      {
        name: '_',
        symbols: ['_$ebnf$1'],
        postprocess: function(d) {
          return null;
        }
      }
    ],
    ParserStart: 'main'
  };
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = grammar;
  } else {
    window.grammar = grammar;
  }
})();
