import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import batch from '../src/queue';

const task = (ret, delay = 100) => new Task((resolve, reject) => {
  setTimeout(() => resolve(ret), delay);
});

describe('Unit: queue()', function () {
  it('should work properly', function (done) {
    const arr = [1, 2, 3, 4];
    const tasks = arr.map(n => task(n));
    const runer = batch(tasks);
    const time = new Date();

    runer.then(rslt => {
      try {
        expect(rslt).to.deep.eq(arr);
        expect(new Date() - time).to.within(400, 500);
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
      batch([null]);
    }).to.throw(TypeError);
  });
});
