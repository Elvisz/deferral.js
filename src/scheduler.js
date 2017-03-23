import TaskWrapper from './task-wrapper';

const _after = Symbol('after');
const _queue = Symbol('queue');
const _done = Symbol('done');
const _defferal = Symbol('defferal');

/**
 * Class Scheduler.
 * @example
 * const scheduler = new Scheduler(['queue1']);
 * const task = new Task((resolve, reject) => resolve());
 *
 * stream.add(task); // task will run after all code executed.
 */
export default class Scheduler {
  /**
   * Create a stream.
   * @param {array} queue - Define scheduler queues.
   * @param {promise} [after] - Define the scheduler after Promise.
   */
  constructor(queue, after = Promise.resolve()) {
    if(!Array.isArray(queue)) {
      throw TypeError();
    }

    if(arguments.length > 1 && !(after instanceof Promise)) {
      throw TypeError();
    }

    Object.assign(this, {
      /**
       * @private
       */
      [_after]: after,
      /**
       * @private
       */
      [_done]: () => {},

      /**
       * @private
       */
      [_queue]: queue.reduce((map, node) => {
        let name;
        let unique;
        let once;

        if(typeof node === 'string') {
          name = node;
          unique = false;
          once = false;
        }

        if(typeof node === 'object' && node.constructor === Object) {
          name = node.name;
          unique = node.unique;
          once = node.once;
        }

        return map.set(name, {
          unique,
          once,
          tasks: []
        });
      }, new Map())
    });
  }

  /**
   * @private
   */
  [_defferal]() {
    /**
     * @private
     */
    this.running = true;
    this[_after].then(() => {
      (async () => {
        const names = [...this[_queue].keys()];
        const results = [];
        let name;

        while(name = names.shift()) {
          const { tasks, unique, once } = this[_queue].get(name);
          const set = new Set();
          let _tasks = tasks;

          if(unique || once) {
            // if requires unique, keep the latest task.
            // if requires once, keep the first task.
            _tasks = (once ? tasks : tasks.reverse()).filter((taskWrapper) => {
              if(!set.has(taskWrapper.task)) {
                set.add(taskWrapper.task);
                return true;
              }

              return false;
            });
            _tasks = once ? _tasks : _tasks.reverse();
          }

          await Promise.all(_tasks.map(wrapper => wrapper.run())).then((result) => {
            // clear scheduled tasks
            tasks.length = 0;

            // save the result
            results.push(result);
          });
        }

        this.running = false;
        this[_done](results);
      })();
    });
  }

  /**
   * Define the scheduler will executed after a given Promise.
   * @param {Promise} after - Promise for scheduler.
   * @return {Scheduler} Scheduler instance.
   */
  after(after) {
    if(!(after instanceof Promise)) {
      throw TypeError();
    }

    /**
     * @private
     */
    this[_after] = after;

    return this;
  }

  /**
   * Define the scheduler done callback.
   * @param {function} done - Done callback for scheduler.
   * @return {Scheduler} Scheduler instance.
   */
  done(done) {
    if(typeof done !== 'function') {
      throw new TypeError();
    }

    /**
     * @private
     */
    this[_done] = done;

    return this;
  }


  /**
   * Push a task to scheduler and run.
   * @param {Task} task - The task will be put into the scheduler.
   * @param {string} to - The task will be put into the which scheduler queue.
   * @param {...*} [params] - Parameters for task will be run in the scheduler.
   * @return {TaskWrapper} TaskWrapper.
   */
  add(task, to, ...params) {
    const wrap = new TaskWrapper(task, ...params);

    if(this[_queue].has(to)) {
      const batch = this[_queue].get(to);
      const tasks = batch.tasks;

      if(!this.running) {
        this[_defferal]();
      }

      tasks.push(wrap);
      return wrap;
    }

    throw new Error(`[${to}] queue is not exist!`);
  }
}
