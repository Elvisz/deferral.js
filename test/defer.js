import 'babel-polyfill';
import {
  expect
} from 'chai';
import defer from '../src/defer';
import { NOT_A_ASYNC_FUNCTION, NOT_A_PROMISE } from '../src/config/errors';

const success = (ret, delay = 150) => new Promise(resolve => setTimeout(() => resolve(ret), delay));
const failure = (ret, delay = 150) => new Promise((resolve, reject) => setTimeout(() => reject(ret), delay));
const task = (ret, delay = 150, succeed = true) => async (param = ret) => succeed ? success(param, delay) : failure(ret, delay);

describe('Unit: defer()', function () {
  it('then should work properly', function (done) {
    const time = new Date();

    defer(task('success')).then(rslt => {
      try {
        expect(rslt).to.eq('success');
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('catch should work properly', function (done) {
    const time = new Date();

    defer(task('fail', 150, false)).catch(reason => {
      try {
        expect(reason).to.eq('fail');
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('first param should be a async function', function() {
    expect(() => {
      defer(null);
    }).to.throw(NOT_A_ASYNC_FUNCTION);
  });

  it('second param should be a Promise', function () {
    expect(() => {
      defer(task(), null);
    }).to.throw(NOT_A_PROMISE);
  });
});
