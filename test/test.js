import test from 'ava';
import jsdom from 'jsdom';
// import 'angular';
// import 'angular-mocks';

//
const dom = {
  then: (resolve, reject) => {
    const config = {
      html: '<!doctype html><html><head><meta charset="utf-8"></head><body>asdf</body></html>',
      scripts: [],
      done: (err, window) => {
        if (err) {
          reject(err);
        } else {
          // Angular dependencies
          global.window = window;
          global.document = window.document;
          global.Node = window.Node;

          // Fixes `angular is not defined` in index.js
          global.angular = null;

          require('angular');

          // Make angular available for angular-mocks
          global.angular = window.angular;
          require('angular-mocks');

          angular.module('app', []);

          resolve(window);
        }
      }
    };

    jsdom.env(config);
  }
};

test(t => {
  return Promise.resolve(dom)
    .then(window => {
      const body = window.document.querySelector('body').textContent;
      t.is(body, 'asdf');
    });
});
