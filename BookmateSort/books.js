var availableBooks;

function createTbl(books) {
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  tbl.setAttribute('cellpadding', '10');
  var tbdy = document.createElement('tbody');
  var tr, td, a;
  for (var i = 0; i < books.length; i++) {
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
  var numOfBooksLoaded = 0;

  function more(booksLoaded) {
    numOfBooksLoaded += booksLoaded.length;
    document.getElementById('status').innerText = "Loaded " + numOfBooksLoaded + " books from the Bookmate. Loading more books...";
  }

  function noMore(booksLoaded) {
    availableBooks = sortArrByKey(booksLoaded, 'paper_pages');
    document.getElementById('status').innerText = "It's fine! Loaded " + numOfBooksLoaded + " books from the Bookmate. Loading complete.";

    createTbl(availableBooks);
  }

  dlBooks(type, 512, more, noMore);
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
      }
    } catch (e) {
        console.log(e);
    }
}, false);
