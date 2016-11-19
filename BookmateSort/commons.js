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

function chain(callback) {
  var queue = [];
  function _next() {
    var cb = queue.shift();
    if (cb) {
      cb(_next);
    }
  }
  setTimeout(_next, 0);
  var then = function(cb) {
  queue.push(cb);
    return { then: then };
  };
  return then(callback);
}

function loop(loopBody, stopСondition) {
  var promise = chain(function z(next) {
    if (!stopСondition()) {
      promise.then(z);
      loopBody(next);
    }
  });
}

function sortArrByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
