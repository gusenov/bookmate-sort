function createTbl(books, type) {
    var item,
        itemAuthors,
        itemState,
        itemKind,
        itemPaperPages,
        itemUrl,
        itemCanBeRead,
        itemLanguage,
        itemReadersCount;

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    tbl.setAttribute('cellpadding', '10');
    var tbdy = document.createElement('tbody');
    var tr, td, a;
    for (var i = 0; i < books.length; i++) {
        item = books[i];

        itemCanBeRead = 'can_be_read' in item ? item.can_be_read : item.book.can_be_read;
        if (itemCanBeRead === false) { continue; }
        
        itemKind = ('labels' in item && 'kind' in item.labels[0]) ? item.labels[0].kind : item.book.labels[0].kind;
        if (type.localeCompare('premium') === 0 && itemKind.localeCompare('premium') !== 0) { continue; }
        
        itemLanguage = 'lang' in item ? item.lang : item.book.language;
        if (type.localeCompare('ru') === 0) {
            if (!itemLanguage || itemLanguage.localeCompare('ru') !== 0) {
                continue;
            }
        } else if (type.localeCompare('en') === 0) {
            // The following table is ordered from highest (20) to lowest (0) precedence.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
            // 5  ||
            // 6  &&
            // 10 !==
            // 16 !
            if (!itemLanguage || itemLanguage && itemLanguage.localeCompare('en') !== 0) {
                continue;
            }
        }

        tr = document.createElement('tr');

        td = document.createElement('td');
        itemAuthors = ('authors' in item) ? item.authors : item.book.authors;
        td.appendChild(document.createTextNode(itemAuthors));
        tr.appendChild(td);

        a = document.createElement('a');
        itemUrl = 'https://bookmate.com/books/' + ('book_uuid' in item ? item.book_uuid : item.book.uuid);
        a.setAttribute('href', itemUrl);
        a.innerHTML = item.title;
        td = document.createElement('td');
        td.appendChild(a);
        tr.appendChild(td);

        td = document.createElement('td');
        itemPaperPages = ('paper_pages' in item) ? item.paper_pages : item.book.paper_pages;
        td.appendChild(document.createTextNode(itemPaperPages));
        tr.appendChild(td);

        td = document.createElement('td');
        itemState = ('lc' in item && 'state' in item.lc) ? item.lc.state : item.state;
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
        td.appendChild(document.createTextNode(itemKind));
        tr.appendChild(td);
        
        if ('book' in item && 'readers_count' in item.book) {
            itemReadersCount = item.book.readers_count;
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
