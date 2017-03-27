import Task from './task';

const fn = () => {};

const _params = Symbol('params');
const _success = Symbol('success');
const _fail = Symbol('fail');

/**
 * Class representing a task wrapper.
 * @example
 * const task = new Task((resolve, reject, result) => resolve(result));
 * const wrapper = new TaskWrapper(task, 'test');
 *
 * wrapper.success(r => console.log(r));
 * wrapper.run(); // console out put: 'test'
 */
export default class TaskWrapper {
  /**
   * Create a task wrapper.
   * @param {Task} task - A task for TaskWrapper.
   * @param {...*} [params] - Parameters for task.
   */
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

  /**
   * Define the success handler when task run.
   * @param {function} handler - Callback after task run successfully.
   * @return {TaskWrapper} The TaskWrapper instance.
   */
  success(handler) {
    if(typeof handler !== 'function') {
      throw new TypeError('TaskWrapper.success(handler), handler should be a function.');
    }

    /**
     * @private
     */
    this[_success] = handler;
    return this;
  }

  /**
   * Define the fail handler when task run.
   * @param {function} handler - Callback after task run failed.
   * @return {TaskWrapper} The TaskWrapper instance.
   */
  fail(handler) {
    if(typeof handler !== 'function') {
      throw new TypeError('TaskWrapper.fail(handler), handler should be a function.');
    }

    /**
     * @private
     */
    this[_fail] = handler;
    return this;
  }

  /**
   * Run the task.
   * @return {Promise} The task promise.
   */
  run() {
    const task = this.task;
    const context = task.context();

    return task.run(...this[_params]).then((result) => {
      this[_success].call(context, result);
      return result;
    }).catch((reason) => {
      this[_fail].call(context, reason);
      return reason;
    });
  }
}
