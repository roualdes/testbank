// copied from http://www.codingepiphany.com/2013/05/19/js-snippets-filter-a-list-with-jquery-and-javascript-regular-expression/ on 2017-01-09
$('#search').keyup(function() {
    var filterValue = $(this).val();

    // start by showing all the things
    $('#testbank > .panel.panel-default').each(function(index, item) {
        $(this).show();
    })

    // build official search
    var searchString = "";

    // if special searching

    // TODO (ear) searching Tags this way lacks finesse and
    // necessitates full matches.  Try to drop the <span
    // id="searchTags"> business and just search the text.

    var idxcolon = filterValue.indexOf(':');
    if (idxcolon > -1) {
        var keyword = filterValue.slice(0, idxcolon);
        var wordz = filterValue.slice(idxcolon+1, filterValue.length).trim();

        switch (keyword) {
        case "Author":
            searchString += "<span id=\"searchAuthor\">";
            break;
        case "Answer":
            searchString += "<span id=\"searchAnswer\">";
            break;
        case "Question":
            searchString += "<span id=\"searchQuestion\">";
            break;
        case "Tags":
            searchString += "<span id=\"searchTags\">";
            break;
        default:
            searchString += "";
        }

        searchString += wordz;
    } else {
        searchString = filterValue;
    }

    itemsToHide = $('#testbank').find('.panel.panel-default').not(function(index) {
        var currentCode = $(this).html();
            return currentCode.match(new RegExp(searchString, "g"));
        })

    itemsToHide.each(function(index) {
        $(this).hide();
    })

})
