import 'babel-polyfill';
import {
  expect
} from 'chai';
import all from '../src/all';
import { NOT_A_ASYNC_FUNCTION, NOT_A_ARRAY } from '../src/config/errors';

const success = (ret, delay) => new Promise(resolve => setTimeout(() => resolve(ret), delay));
const failure = (ret, delay) => new Promise((resolve, reject) => setTimeout(() => reject(ret), delay));
const task = (ret, delay = 150, succeed = true) => async (param = ret) => succeed ? success(param, delay) : failure(ret, delay);

describe('Unit: all()', function () {
  it('then should work properly', function (done) {
    const arr = [1, 2, 3];
    const asyncs = arr.map(n => task(n, n * 50));
    const time = new Date();

    all(asyncs).then(rslt => {
      try {
        expect(rslt).to.deep.eq(arr);
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('catch should work properly', function (done) {
    const time = new Date();

    all([task(null, 150, false)]).catch(reason => {
      try {
        expect(reason).to.eq(null);
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('first param should be a array', function() {
    expect(() => {
      all();
    }).to.throw(NOT_A_ARRAY);
  });

  it('params should be work properly', function(done) {
    const time = new Date();

    all([task()], 'params').then(rslt => {
      try {
        expect(rslt).to.deep.eq(['params']);
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should run async functions', function (done) {
    all([null]).catch(rslt => {
      expect(rslt).to.eq(NOT_A_ASYNC_FUNCTION);
      done();
    });
  });
});
