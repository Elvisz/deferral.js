import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import batch from '../src/hash';

const task = (ret, delay = 100) => new Task((resolve, reject) => {
  setTimeout(() => resolve(ret), delay);
});

describe('Unit: hash()', function () {
  it('should work properly', function (done) {
    const map = {
      a: 'a',
      b: 'b',
      c: 'c'
    };
    const tasks = Object.keys(map).reduce((map, key) => {
      map[key] = task(key);
      return map;
    }, {});
    const runer = batch(tasks);
    const time = new Date();

    runer.then(rslt => {
      try {
        expect(rslt).to.deep.eq(map);
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should throw error', function() {
    expect(() => {
      batch();
    }).to.throw(TypeError);
  });

  it('should be task', function() {
    expect(() => {
      batch({ a: null });
    }).to.throw(TypeError);
  });
});
