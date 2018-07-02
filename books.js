function getKind(item) {
  if ('labels' in item
    && Array.isArray(item.labels)
    && item.labels.length > 0
    && 'kind' in item.labels[0]) {
      return item.labels[0].kind;

  } else if ('book' in item
    && 'labels' in item.book
    && Array.isArray(item.book.labels)
    && item.book.labels.length > 0
    && 'kind' in item.book.labels[0]) {
      return item.book.labels[0].kind;
  }

  return "";
}

function isPremium(item) {
  if (getKind(item).localeCompare('premium') === 0) {
    return true;
  }
  return false;
}

function canBeRead(item) {
  if ('can_be_read' in item) {
    return item.can_be_read;

  } else if ('book' in item
    && 'can_be_read' in item.book) {
      return item.book.can_be_read;
  }

  return false;
}

function getLanguage(item) {
  if ('lang' in item) {
    return item.lang;

  } else if ('book' in item
    && 'language' in item.book) {
    return item.book.language;
  }

  return "";
}

function isRussian(item) {
  if (getLanguage(item).localeCompare('ru') === 0) {
    return true;
  }

  return false;
}

function isEnglish(item) {
  if (getLanguage(item).localeCompare('en') === 0) {
    return true;
  }

  return false;
}

function getAuthors(item) {
  if ('authors' in item) {
    return item.authors;

  } else if ('book' in item
    && 'authors' in item.book) {
      return item.book.authors;
  }

  return "";
}

function getPaperPages(item) {
  if ('paper_pages' in item) {
    return item.paper_pages;

  } else if ('book' in item
    && 'paper_pages' in item.book) {
      return item.book.paper_pages;
  }

  return 0;
}

function getBookUuid(item) {
  if ('book_uuid' in item) {
    return item.book_uuid;

  } else if ('book' in item
    && 'uuid' in item.book) {
      return item.book.uuid;
  }

  return "";
}

function getState(item) {
  if ('lc' in item
    && 'state' in item.lc) {
      return item.lc.state;

  } else if ('state' in item) {
    return item.state;
  }

  return "";
}

function getTitle(item) {
  if ('title' in item
    && item.title.trim()) {
      return item.title;

  } else if ('book' in item
    && 'title' in item.book) {
      return item.book.title;
  }

  return "";
}

function getReadersCount(item) {
  if ('book' in item
    && 'readers_count' in item.book) {
      return item.book.readers_count;
  }

  return -1;
}

function createTbl(books, type) {
    var item, itemState, itemReadersCount;

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellpadding', '10');
    var tbdy = document.createElement('tbody');
    var tr, td, a;
    for (var i = 0; i < books.length; i++) {
        item = books[i];

        if (!canBeRead(item)) { continue; }
        if (type.localeCompare('premium') === 0 && !isPremium(item)) { continue; }
        if (type.localeCompare('ru') === 0 && !isRussian(item)) { continue;
        } else if (type.localeCompare('en') === 0 && !isEnglish(item)) { continue; }

        tr = document.createElement('tr');

        td = document.createElement('td');
        td.appendChild(document.createTextNode(getAuthors(item)));
        tr.appendChild(td);

        a = document.createElement('a');
        a.setAttribute('href', 'https://bookmate.com/books/' + getBookUuid(item));
        a.innerHTML = getTitle(item);
        td = document.createElement('td');
        td.appendChild(a);
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(getPaperPages(item)));
        tr.appendChild(td);

        td = document.createElement('td');
        itemState = getState(item);
        switch (itemState) {
            case 'pending':
                itemState = 'to-read';
                break;
            case 'reading':
                itemState += '-now';
                break;
        }
        td.appendChild(document.createTextNode(itemState));
        tr.appendChild(td);

        td = document.createElement('td');
        td.appendChild(document.createTextNode(getKind(item)));
        tr.appendChild(td);

        itemReadersCount = getReadersCount(item);
        if (itemReadersCount >= 0) {
            td = document.createElement('td');
            td.appendChild(document.createTextNode(itemReadersCount));
            tr.appendChild(td);
        }

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    document.getElementById('books').appendChild(tbl);
}

function loadBooks(userChoice){
    var allBooks = [],
        booksLoaded,
        pageIndex = 1;

    function getEndpoint() {
        var fileName;
        switch (userChoice) {
            case 'readers-count':
                return 'https://ru.bookmate.com/p/api/v5/profile/library_cards?page=' + pageIndex + '&per_page=256';
            case 'premium':
            case 'ru':
            case 'en':
                fileName = 'all';
                break;
            default:
                fileName = userChoice;
        }
        return 'https://bookmate.com/a/4/u/d/' + fileName + '.json?page=' + pageIndex + '&p=' + pageIndex + '&per_page=256';
    }

    SeqExec.loop(function loopBody(cont) {
        getJsonAsObj(getEndpoint(), function (books) {
            switch (userChoice) {
                case 'readers-count':
                    booksLoaded = books.library_cards;
                    break;
                default:
                    booksLoaded = books;
            }
            //console.log(JSON.stringify(booksLoaded));
            Array.prototype.push.apply(allBooks, booksLoaded);
            document.getElementById('status').innerText = "Loaded " + allBooks.length + " books from the Bookmate. Loading more books...";
            pageIndex += 1;
            cont(); // continue
        });
    }, function stopCondition() {
        if (booksLoaded && booksLoaded.length === 0) {
            document.getElementById('status').innerText = "It's fine! Loaded " + allBooks.length + " books from the Bookmate. Loading complete.";
            var resultBooks;
            switch (userChoice) {
                case 'readers-count':
                    resultBooks = sortArrByKey(allBooks, 'book.readers_count', false);
                    break;
                default:
                    resultBooks = sortArrByKey(allBooks, 'paper_pages', true);
            }
            //document.write(JSON.stringify(resultBooks));
            //console.log(JSON.stringify(resultBooks));
            createTbl(resultBooks, userChoice);
            return true;
        } else {
            return false;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    try {
        var currentUrl = window.location.href;

        if (currentUrl.endsWith('#all')) {
            loadBooks('all');
            document.title = "all";
        } else if (currentUrl.endsWith('#to-read')) {
            loadBooks('read_later');
            document.title = "to-read";
        } else if (currentUrl.endsWith('#currently-reading')) {
            loadBooks('now_reading');
            document.title = "currently-reading";
        } else if (currentUrl.endsWith('#read')) {
            loadBooks('finished');
            document.title = "read";
        }

        else if (currentUrl.endsWith('#en')) {
            loadBooks('en');
            document.title = "en";
        } else if (currentUrl.endsWith('#ru')) {
            loadBooks('ru');
            document.title = "ru";
        }

        else if (currentUrl.endsWith('#premium')) {
            loadBooks('premium');
            document.title = "premium";
        }

        else if (currentUrl.endsWith('#readers-count')) {
            loadBooks('readers-count');
            document.title = "readers-count";
        }
    } catch (e) {
        console.log(e);
    }
}, false);
