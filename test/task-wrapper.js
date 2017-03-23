import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';
import TaskWrapper from '../src/task-wrapper';

const task = new Task((resolve, reject) => resolve());

describe('Unit: TaskWrapper', function(){
  it('create a task-wrapper should be ok.', function(){
    const taskWrapper = new TaskWrapper(task);

    expect(taskWrapper).to.be.an.instanceof(TaskWrapper);
  });

  it('create a task-wrapper should be failed.', function(){
    expect(() => {
      return new TaskWrapper();
    }).to.throw(TypeError);

    expect(() => {
      return new TaskWrapper((resolve, reject) => resolve());
    }).to.throw(TypeError);
  });

  it('create with parameters should be work properly.', function(){
    const task = new Task(function(resolve, reject, ...args) {
      resolve(args);
    });
    const taskWrapper = new TaskWrapper(task, 'a', 'b');

    taskWrapper.run().then(ret => {
      expect(ret).to.have.lengthOf(2);
      expect(ret[0]).to.eq('a');
      expect(ret[1]).to.eq('b');
    });
  });

  it('run() should be work properly.', function(done){
    const taskWrapper = new TaskWrapper(task);
    const promise = taskWrapper.run();

    expect(promise).to.be.an.instanceof(Promise);
    promise.then(done);
  });

  it('success() should be work properly.', function(done){
    const taskWrapper = new TaskWrapper(task);

    taskWrapper.success(done);
    taskWrapper.run();
  });

  it('success() should not be work properly.', function(){
    const taskWrapper = new TaskWrapper(task);

    expect(() => {
      taskWrapper.success();
    }).to.throw(TypeError);
  });

  it('fail() should be work properly.', function(done){
    const taskWrapper = new TaskWrapper(new Task((resolve, reject) => reject()));

    taskWrapper.fail(done);
    taskWrapper.run();
  });

  it('fail() should not be work properly.', function(){
    const taskWrapper = new TaskWrapper(task);

    expect(() => {
      taskWrapper.fail();
    }).to.throw(TypeError);
  });
});
