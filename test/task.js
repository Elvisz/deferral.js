import 'babel-polyfill';
import {
  expect
} from 'chai';
import Task from '../src/task';

describe('Unit: Task', function(){
  it('create a task should be ok.', function(){
    const task = new Task((resolve, reject) => resolve());

    expect(task).to.be.an.instanceof(Task);
  });

  it('create a task should be failed.', function(){
    expect(() => {
      return new Task();
    }).to.throw(TypeError);

    expect(() => {
      return new Task((resolve) => resolve());
    }).to.throw(TypeError);
  });

  it('run() should be work properly.', function(done){
    const task = new Task((resolve, reject) => resolve());

    task.run().then(done);
  });

  it('run(...args) should be work properly.', function(){
    const task = new Task(function(resolve, reject, ...args) {
      resolve(args);
    });

    task.run('a', 'b').then(ret => {
      expect(ret).to.have.lengthOf(2);
      expect(ret[0]).to.eq('a');
      expect(ret[1]).to.eq('b');
    });
  });

  it('bind() should be work properly.', function(){
    const task = new Task(function(resolve, reject) {
      resolve(this.val);
    });
    const context = { val: 'test' };
    task.bind(context);

    task.run().then(ret => {
      expect(ret).to.be.eq(context.val);
    });
  });
});
