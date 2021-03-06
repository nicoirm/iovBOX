//let assertB_ = require("assert");
let assert_ = require("power-assert");
let ssh2_ = require("../src/ssh2promise").SSH2UTILS;
let fs_ = require("fs");
let path_ = require("path");

// ['log', 'warn', 'error'].forEach(a => { let b = console[a]; console[a] = (...c) => { try { throw new Error } catch (d) { b.apply(console, [d.stack.split('\n')[2].trim().substring(3).replace(__dirname, '').replace(/\s\(./, ' at ').replace(/\)/, ''), '\n', ...c]) } } });
// console.log("hello,log");
// console.warn("hello,warn.");
// console.error("hello,error.");
let io_ = require('socket.io-client');
let socket_ = io_.connect("http://192.168.75.130:1123");
socket_.on('data', function(data) {
  console.log(data);  
});


function shouldRejected(promise) {
  return {
    'catch': function (fn) {
      return promise.then(function () {
        throw new Error('Expected promise to be rejected but it was fulfilled');
      }, function (reason) {
        fn.call(promise, reason);
      });
    }
  };
}

function shouldFulfilled(promise) {
  return {
    'then': function (fn) {
      return promise.then(function (value) {
        fn.call(promise, value);
      }, function (reason) {
        throw reason;
      });
    }
  };
}

describe('A Suite: Configuration read Function Sets', function () {
  context('Function Sets I context', function () {
    let rmt_tt = new ssh2_();
    let cfg = 'ssh2.cfg';

    it('1# initConfig read with ssh2.cfg (wrong) format', function (done) {
      fs_.open("ssh2.cfg", "a+", 0644, function (e, fd) {
        if (e) throw e;
        fs_.write(fd, "pollute the file!", 0, 'utf8', function (e) {
          if (e) throw e;
          fs_.closeSync(fd);
        })
      });
      rmt_tt.initConfig(fs_, "ssh2.cfg", (err, config) => {
        assert_(config == null);
        done();
      });
    });

    it('2# initConfig read without config file', function (done) {
      try {
        fs_.unlinkSync(cfg);
      } catch (err) {
        // handle the error
        console.log(err);
      }
      rmt_tt.initConfig(fs_, "ssh2.cfg", (err, config) => {
        assert_(config != null);
        done();
      });
    });

  });
});

describe('B Suite: SSH Function Sets', function () {
  context('Function Sets I context', function () {
    let rmt_t1 = new ssh2_();
    let svr_cfg1 = {
      host: "192.168.75.130",
      port: 22,
      username: "lvyu",
      password: "1234567",
      remotePath: "~",
      localPath: "e:/_proj/driver/node-v6.11.3/Debug/iovBOX/",
      exclude: ['.git', '.vscode']
    };
    let rmt_t2 = new ssh2_();
    let svr_cfg2 = {
      host: "192.168.75.130",
      port: 22,
      username: "lvyu",
      password: "123456",
      remotePath: "~",
      localPath: "e:/_proj/driver/node-v6.11.3/Debug/iovBOX/",
      exclude: ['.git', '.vscode']
    };

    it('1# connect function by wrong key', function () {
      let newp = Promise.resolve().then(result => { return rmt_t1.connect(svr_cfg1); });
      return shouldRejected(newp).catch(function (error) {
        assert_(error === 'error');
      });
    });

    it('2# connect function with right key', function () {
      let newp = Promise.resolve().then(result => { return rmt_t2.connect(svr_cfg2); });
      return shouldFulfilled(newp).then(function (value) {
        assert_(value === 'ready');
      });
    });

  });
});

