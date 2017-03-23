import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import Stream from '../src/stream';

const task = new Task((resolve, reject) => resolve());

describe('Unit: Stream', function () {
  it('create a debounce stream should be work.', function () {
    const stream = new Stream();

    expect(stream.mode).to.be.eq('debounce');
  });

  it('create a throttle stream should be work.', function () {
    const stream = new Stream('throttle');

    expect(stream.mode).to.be.eq('throttle');
  });

  context('debounce', function () {
    it('should be work poroperly.', function (done) {
      const stream = new Stream('debounce');
      const task = new Task((resolve, reject) => {
        resolve();
      });

      stream.run(task).success(() => {
        try {
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should be work poroperly with parameters.', function (done) {
      const stream = new Stream('debounce');
      const task = new Task((resolve, reject, ret) => {
        resolve(ret);
      });

      stream.run(task, 0);
      stream.run(task, 1);
      stream.run(task, 2).success(ret => {
        try {
          expect(ret).to.be.eq(2);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('delay should be work poroperly.', function (done) {
      const stream = new Stream('debounce', 200);
      const task = new Task((resolve, reject) => {
        resolve();
      });
      const start = new Date();

      stream.run(task).success(ret => {
        try {
          expect(new Date() - start).to.be.within(200, 300);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('immediately should be work poroperly.', function (done) {
      const stream = new Stream('debounce', 800, true);
      const task = new Task((resolve, reject) => {
        resolve();
      });
      const start = new Date();

      stream.run(task).success(ret => {
        try {
          expect(new Date() - start).to.be.within(0, 100);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  context('throttle', function () {
    it('should be work poroperly.', function (done) {
      const stream = new Stream('throttle');
      const task = new Task((resolve, reject) => {
        resolve();
      });

      stream.run(task).success(ret => {
        try {
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('should be work poroperly with parameters.', function (done) {
      const stream = new Stream('throttle');
      const task = new Task((resolve, reject, ret) => {
        resolve(ret);
      });

      stream.run(task, 0).success(ret => {
        try {
          expect(ret).to.be.eq(0);
          done();
        } catch (e) {
          done(e);
        }
      });
      stream.run(task, 1);
    });

    it('delay should be work poroperly.', function (done) {
      const stream = new Stream('throttle', 200);
      const task = new Task((resolve, reject) => {
        resolve();
      });
      const start = new Date();

      stream.run(task).success(ret => {
        try {
          expect(new Date() - start).to.be.within(200, 300);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('immediately should be work poroperly.', function (done) {
      const stream = new Stream('throttle', 800, true);
      const task = new Task((resolve, reject) => {
        resolve();
      });
      const start = new Date();

      stream.run(task).success(ret => {
        try {
          expect(new Date() - start).to.be.within(0, 100);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
