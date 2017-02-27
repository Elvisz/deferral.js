import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import Deferral from '../src/index';

const { all, queue, hash, pipe } = Deferral;
const task = (ret, delay = 100) => new Task((resolve, reject) => {
  setTimeout(() => resolve(ret), delay);
});
const fn = () => {};

describe('Unit: Deferral', function () {
  context('should work properly', function () {
    it('all(tasks)', function (done) {
      const arr = [1, 2, 3, 4];
      const tasks = arr.map(n => task(n));
      const runer = all(tasks);
      const time = new Date();

      runer.then(rslt => {
        try {
          expect(rslt).to.deep.eq(arr);
          expect(new Date() - time).to.within(100, 200);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('hash(tasks)', function (done) {
      const map = {
        a: 'a',
        b: 'b',
        c: 'c'
      };
      const tasks = Object.keys(map).reduce((map, key) => {
        map[key] = task(key);
        return map;
      }, {});
      const runer = hash(tasks);
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

    it('queue(tasks)', function (done) {
      const arr = [1, 2, 3, 4];
      const tasks = arr.map(n => task(n));
      const runer = queue(tasks);
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

    it('pipe(tasks)', function (done) {
      const task = new Task((resolve, reject, n) => resolve(n * 2));
      const runer = pipe([task, task, task], 2);

      runer.then(rslt => {
        try {
          expect(rslt).to.eq(16);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  context('should throw error', function() {
    it('all()', function() {
      expect(() => {
        all();
      }).to.throw(TypeError);
    });

    it('hash()', function() {
      expect(() => {
        hash();
      }).to.throw(TypeError);
    });

    it('pipe()', function() {
      expect(() => {
        pipe();
      }).to.throw(TypeError);
    });

    it('queue()', function() {
      expect(() => {
        queue();
      }).to.throw(TypeError);
    });
  });

  context('should be task', function() {
    it('all([task])', function() {
      expect(() => {
        all([null]);
      }).to.throw(TypeError);
    });

    it('queue([task])', function() {
      expect(() => {
        queue([null]);
      }).to.throw(TypeError);
    });

    it('pipe([task])', function() {
      expect(() => {
        pipe([null]);
      }).to.throw(TypeError);
    });

    it('hash([task])', function() {
      expect(() => {
        hash({a: null});
      }).to.throw(TypeError);
    });
  });
});
