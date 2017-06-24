
function createTbl(books, type) {
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  tbl.setAttribute('cellpadding', '10');
  var tbdy = document.createElement('tbody');
  var tr, td, a;
  for (var i = 0; i < books.length; i++) {
      if (books[i].can_be_read === false) { continue; }
      if (type.localeCompare('premium') === 0 && books[i].labels[0].kind.localeCompare('premium') !== 0) { continue; }
      if (type.localeCompare('ru') === 0 && books[i].lang.localeCompare('ru') !== 0) { continue; }
      if (type.localeCompare('en') === 0 && books[i].lang.localeCompare('en') !== 0) { continue; }
      
      tr = document.createElement('tr');

      td = document.createElement('td');
      td.appendChild(document.createTextNode(books[i].authors));
      tr.appendChild(td);

      a = document.createElement('a');
      a.setAttribute('href', 'https://bookmate.com/books/' + books[i].book_uuid);
      a.innerHTML = books[i].title;
      td = document.createElement('td');
      td.appendChild(a);
      tr.appendChild(td);

      td = document.createElement('td');
      td.appendChild(document.createTextNode(books[i].paper_pages));
      tr.appendChild(td);

      td = document.createElement('td');
      td.appendChild(document.createTextNode(books[i].lc.state));
      tr.appendChild(td);

      td = document.createElement('td');
      td.appendChild(document.createTextNode(books[i].labels[0].kind));
      tr.appendChild(td);

      tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  document.getElementById('books').appendChild(tbl);
}

function loadBooks(type){
  var numOfBooksLoaded = 0,
      dl_type = type;

  function more(booksLoaded) {
    numOfBooksLoaded += booksLoaded.length;
    document.getElementById('status').innerText = "Loaded " + numOfBooksLoaded + " books from the Bookmate. Loading more books...";
  }

  function noMore(booksLoaded) {
    document.getElementById('status').innerText = "It's fine! Loaded " + numOfBooksLoaded + " books from the Bookmate. Loading complete.";
    var resultBooks = [];
    resultBooks = sortArrByKey(booksLoaded, 'paper_pages');
    // document.write(JSON.stringify(resultBooks));
    createTbl(resultBooks, type);
  }

  if (type.localeCompare('premium') === 0
        || type.localeCompare('ru') === 0
        || type.localeCompare('en') === 0) { dl_type = 'all'; }
    
  dlBooks(dl_type, 256, more, noMore);
}

document.addEventListener("DOMContentLoaded", function () {
    try {
      var currentUrl = window.location.href;
      if (currentUrl.endsWith('#all')) {
        loadBooks('all');
        document.title = "all";
      } else if (currentUrl.endsWith('#currently-reading')) {
        loadBooks('now_reading');
        document.title = "currently-reading";
      } else if (currentUrl.endsWith('#read')) {
        loadBooks('finished');
        document.title = "read";
      } else if (currentUrl.endsWith('#to-read')) {
        loadBooks('read_later');
        document.title = "to-read";
      } else if (currentUrl.endsWith('#premium')) {
        loadBooks('premium');
        document.title = "premium";
      } else if (currentUrl.endsWith('#ru')) {
        loadBooks('ru');
        document.title = "ru";
      } else if (currentUrl.endsWith('#en')) {
        loadBooks('en');
        document.title = "en";
      }
    } catch (e) {
        console.log(e);
    }
}, false);
