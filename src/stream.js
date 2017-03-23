import TaskWrapper from './task-wrapper';

const _timer = Symbol('timer');

/**
 * Class Stream.
 * @example
 * const stream = new Stream('debounce', 400, false);
 * const task = new Task((resolve, reject) => resolve());
 *
 * stream.run(task);
 * stream.run(task); // this task will not execute, once timeout with 400ms
 */
export default class Stream {
  /**
   * Create a stream.
   * @param {string} [mode="debounce"] - Stream type.
   * @param {number} [period=400] - Stream exetend parameter, timeout for stream.
   * @param {boolean} [immediately=false] - Stream exetend parameter, if executed immediately for stream.
   */
  constructor(mode = 'debounce', period = 400, immediately = false) {
    Object.defineProperties(this, {
      mode: {
        value: mode // debounce or throttle
      },

      period: {
        value: period // millisecond
      },

      immediately: {
        value: immediately // false as default
      }
    });
  }

  /**
   * Push a task to stream and run.
   * @param {Task} task - The task will be put into the stream.
   * @param {...*} [params] - Parameters for task will be run in the stream.
   * @return {TaskWrapper} TaskWrapper.
   */
  run(task, ...params) {
    const taskWrapper = new TaskWrapper(task, ...params);
    const mode = this.mode;
    const period = this.period;
    const immediately = this.immediately;

    if(immediately && !this[_timer]) {
      taskWrapper.run();
    }

    if(mode === 'throttle') {
      if(this[_timer]) {
        return TaskWrapper;
      }
    }

    if(mode === 'debounce') {
      clearTimeout(this[_timer]);
    }

    /**
     * @private
     */
    this[_timer] = setTimeout(() => {
      if(!immediately) {
        taskWrapper.run();
      }

      this[_timer] = null;
    }, period);

    return taskWrapper;
  }
}
