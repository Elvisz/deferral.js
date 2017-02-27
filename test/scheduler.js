import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import Scheduler from '../src/scheduler';

const task = new Task((resolve, reject, ret) => resolve(ret));

describe('Unit: Scheduler', function(){
  it('create a scheduler should be ok.', function(){
    const scheduler = new Scheduler(['test']);

    expect(scheduler).to.be.an.instanceof(Scheduler);
  });

  it('create a scheduler with after should be ok.', function(){
    const start = new Date();
    const scheduler = new Scheduler(['test'], new Promise(resolve => setTimeout(resolve, 100)));
    scheduler.done(() => {
      try {
        expect(new Date() - start).to.be.within(100, 200);
        done();
      } catch(e) {
        done(e);
      }
    });

    scheduler.add(task, 'test');
  });

  it('create a scheduler should be failed.', function(){
    expect(() => {
      return new Scheduler();
    }).to.throw(TypeError);

    expect(() => {
      return new Scheduler(['test'], null);
    }).to.throw(TypeError);
  });

  it('done() should be work properly.', function(done){
    const scheduler = new Scheduler(['test']);

    expect(() => {
      scheduler.done();
    }).to.throw(TypeError);

    scheduler.done(() => {
      try {
        done();
      } catch(e) {
        done(e);
      }
    });

    scheduler.add(task, 'test');
  });

  it('after() should be work properly.', function(done){
    const start = new Date();
    const scheduler = new Scheduler(['test']);

    expect(() => {
      scheduler.after();
    }).to.throw(TypeError);

    scheduler.after(new Promise(resolve => setTimeout(resolve, 100)));
    scheduler.done(() => {
      try {
        expect(new Date() - start).to.be.within(100, 200);
        done();
      } catch(e) {
        done(e);
      }
    });

    scheduler.add(task, 'test');
  });

  context('add tasks', function(){
    it('should to a existed queue', function(){
      const scheduler = new Scheduler(['test']);

      expect(() => {
        scheduler.add(task, '');
      }).to.throw(Error);

      scheduler.add(task, 'test');
    });

    it('once queue should work', function(done){
      const scheduler = new Scheduler([{
        name: 'test',
        once: true
      }]);
      scheduler.done(result => {
        try {
          expect(result).to.deep.eq([['ok']]);
          done();
        } catch(e) {
          done(e);
        }
      });

      scheduler.add(task, 'test', 'ok');
      scheduler.add(task, 'test', 'no');
    });

    it('unique queue should work', function(done){
      const scheduler = new Scheduler([{
        name: 'test',
        unique: true
      }]);
      scheduler.done(result => {
        try {
          expect(result).to.deep.eq([['no']]);
          done();
        } catch(e) {
          done(e);
        }
      });

      scheduler.add(task, 'test', 'ok');
      scheduler.add(task, 'test', 'no');
    });

    it('queue should work one after one', function(done){
      const start = new Date();
      const scheduler = new Scheduler(['q1', 'q2']);
      const task = new Task((resolve, reject, ret) => setTimeout(() => {
        resolve(ret);
      }, 100));

      scheduler.done(result => {
        try {
          expect(result).to.deep.eq([['q1'], ['q2']]);
          expect(new Date() - start).to.be.within(200, 300);
          done();
        } catch(e) {
          done(e);
        }
      });
      scheduler.add(task, 'q1', 'q1');
      scheduler.add(task, 'q2', 'q2');
    });
  });
});
