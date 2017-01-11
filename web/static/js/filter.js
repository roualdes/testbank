// copied from http://www.codingepiphany.com/2013/05/19/js-snippets-filter-a-list-with-jquery-and-javascript-regular-expression/ on 2017-01-09
$('#search').keyup(function() {
    var filterValue = $(this).val();

    // start by showing all the things
    $('#testbank > .panel.panel-default').each(function(index, item) {
        $(this).show();
    })

    // // build official search
    // var searchString = "";



    // if special searching

    // TODO (ear) searching Tags this way lacks finesse and
    // necessitates full matches.  Try to drop the <span
    // id="searchTags"> business and just search the text.

    // var idxcolon = filterValue.indexOf(':');
    // if (idxcolon > -1) {
    //     var keyword = filterValue.slice(0, idxcolon);
    //     var wordz = filterValue.slice(idxcolon+1, filterValue.length).trim().split(',');

        // switch (keyword) {
        // case "Author":
        //     searchString += "<span id=\"searchAuthor\">";
        //     break;
        // case "Answer":
        //     searchString += "<span id=\"searchAnswer\">";
        //     break;
        // case "Question":
        //     searchString += "<span id=\"searchQuestion\">";
        //     break;
        // case "Tags":
        //     searchString += "<span id=\"searchTags\">";
        //     break;
        // default:
        //     searchString += "";
        // }

        // searchString += wordz;
    // } else {
    //     searchString = filterValue;

    // }

    var itemsToHide = $('#testbank')
        .find('.panel.panel-default')
        .not(function(index) {
            var currentCode = $(this).text();
            return currentCode.match(new RegExp(filterValue, "g"));
        })

    itemsToHide.each(function(index) {
        $(this).hide();
    })

})

// wishes, as examples of potential searches
// median AND mode
// median OR mode
// Author:Edward AND skew
// Author:Edward AND Tag:normal
// (Author:Edward OR Author:Robin) AND Tag:ANOVA -> {"and": [{"or": ["Author:Edward", "Author:Robin"]}, "Tag:ANOVA"}

// ((Author:Edward OR Tag:noraml) AND Tag:regression ->
// {or:
//      [{and: ["Tag:regression", "Author:Edward"]},
//       {and: ["Tag:regression", "Tag:normal"]}]})
