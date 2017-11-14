import 'babel-polyfill';
import {
  expect
} from 'chai';
import hash from '../src/hash';
import { zip } from '../src/utils/utils';
import { NOT_A_ASYNC_FUNCTION, NOT_A_PLAIN_OBJECT } from '../src/config/errors';

const success = (ret, delay) => new Promise(resolve => setTimeout(() => resolve(ret), delay));
const failure = (ret, delay) => new Promise((resolve, reject) => setTimeout(() => reject(ret), delay));
const task = (ret, delay = 150, succeed = true) => async (param = ret) => succeed ? success(param, delay) : failure(ret, delay);

describe('Unit: hash()', function () {
  it('then should work properly', function (done) {
    const arr = [1, 2, 3];
    const asyncs = zip(arr.map(n => `task${n}`), arr.map(n => task(`task${n}`, n * 50)));
    const time = new Date();

    hash(asyncs).then(rslt => {
      try {
        expect(rslt).to.deep.eq({
          task1: 'task1',
          task2: 'task2',
          task3: 'task3'
        });
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('catch should work properly', function (done) {
    const time = new Date();

    hash({ a: task(null, 150, false) }).catch(reason => {
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
      hash();
    }).to.throw(NOT_A_PLAIN_OBJECT);
  });

  it('params should be work properly', function(done) {
    const time = new Date();

    hash({ a: task() }, 'params').then(rslt => {
      try {
        expect(rslt).to.deep.eq({ a: 'params' });
        expect(new Date() - time).to.within(100, 200);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should run async functions', function (done) {
    hash({ a: null }).catch(rslt => {
      expect(rslt).to.eq(NOT_A_ASYNC_FUNCTION);
      done();
    });
  });
});
