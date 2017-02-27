import Task from './task';

const fn = () => {};

const _params = Symbol('params');
const _success = Symbol('success');
const _fail = Symbol('fail');

export default class TaskWrapper {
  constructor(task, ...params) {
    if(task instanceof Task) {
      Object.assign(this, {
        [_params]: params,
        [_success]: fn,
        [_fail]: fn
      });

      Object.defineProperty(this, 'task', {
        value: task
      });
    } else {
      throw new TypeError('TaskWrapper constructor: task is not a Task.');
    }
  }

  success(handler) {
    if(typeof handler !== 'function') {
      throw new TypeError('TaskWrapper.success(handler), handler should be a function.');
    }

    this[_success] = handler;
    return this;
  }

  fail(handler) {
    if(typeof handler !== 'function') {
      throw new TypeError('TaskWrapper.fail(handler), handler should be a function.');
    }

    this[_fail] = handler;
    return this;
  }

  run() {
    return this.task.run(...this[_params]).then((result) => {
      this[_success](result);
      return result;
    }, (reason) => {
      this[_fail](reason);
      return reason;
    });
  }
}
