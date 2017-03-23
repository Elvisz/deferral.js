const REG_EXECUTOR = /\(\s*resolve\s*,\s*reject[^)]*\)[\s\S]+(resolve|reject)\s*(\([\s\S]*\))*/;
const _executor = Symbol('executor');
const _context = Symbol('context');

/**
 * Class representing a task. Promise will execute immediately and task will execute when call task.run();
 * @example
 * const task = new Task((resolve, reject, result) => resolve(result));
 *
 * task.run('test').then(r => console.log(r)); // console out put: 'test'
 */
export default class Task {
  /**
   * Create a task.
   * @param {fuction} executor - A Promise executor liked fuction.
   */
  constructor(executor) {
    if(REG_EXECUTOR.test(executor.toString())) {
      /**
       * @private
       */
      this[_executor] = executor;
    } else {
      throw TypeError('Task constructor requires a parameter which like a Promise executor.');
    }
  }

  /**
   * Run the task.
   * @param {...*} [args] - Parameters for Task.run().
   * @return {Promise} The task promise.
   */
  run(...args) {
    return new Promise((resolve, reject) => this[_executor].apply(this[_context], [resolve, reject].concat(args)));
  }

  /**
   * Bind the task executor context.
   * @param {Object} context - Task executor context.
   * @return {Task} Current task instance.
   */
  bind(context) {
    /**
     * @private
     */
    this[_context] = context;
    return this;
  }
}
