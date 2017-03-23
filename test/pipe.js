import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import batch from '../src/pipe';

const task = new Task((resolve, reject, n) => {
  setTimeout(() => resolve(n * 2), 100);
});

describe('Unit: pipe()', function () {
  it('should work properly', function (done) {
    const runer = batch([task, task, task], 2);
    const time = new Date();

    runer.then(rslt => {
      try {
        expect(rslt).to.eq(16);
        expect(new Date() - time).to.within(300, 400);
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
