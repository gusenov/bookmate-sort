function dlBooks(type, count, onMore, onNoMore) {
  var allBooks = [];
  var currentBooks;
  var pageIdx = 1;

  function more(next) {
    getJsonAsObj('https://bookmate.com/a/4/u/d/' + type + '.json?page=' + pageIdx + '&p=' + pageIdx + '&per_page=' + count, function (books) {
      currentBooks = books;
      onMore(currentBooks);
      Array.prototype.push.apply(allBooks, currentBooks);
      pageIdx += 1;
      next();
    });
  }

  function noMore() {
    if (currentBooks && currentBooks.length === 0) {
      if (onNoMore) {
        onNoMore(allBooks);
      }
      return true;
    } else {
      return false;
    }
  }

  loop(more, noMore);
}
