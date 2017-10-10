function getJsonAsObj(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var jsonString = xhr.responseText;
      var jsonObject = JSON.parse(jsonString);
      // console.log(jsonObject);
      cb(jsonObject);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// https://stackoverflow.com/a/6491621
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function sortArrByKey(array, key, asc) {
    return array.sort(function(a, b) {
        var x = Object.byString(a, key); var y = Object.byString(b, key);
        if (asc) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        } else {
            return ((y < x) ? -1 : ((y > x) ? 1 : 0));
        }
    });
}

isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};
