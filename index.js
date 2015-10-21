function spawn(genFunc) {
  var generator = genFunc();
  function co(type, arg) {
    var res;
    try {
      res = generator[type](arg);
    } catch (e) {
      return Promise.reject(e);
    }
    if (res.done) {
      if (type === 'throw') {
        return arg;
      } else {
        return res.value;
      }
    } else {
      return Promise.resolve(res.value)
      .then(function (val) {
        return co('next', val);
      }, function (err) {
        return co('throw', err);
      });
    }
  }
  co('next');
}

module.exports = spawn;
