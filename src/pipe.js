import Task from './task';

/**
 * Batch run tasks pipe.
 * @param {Task[]} tasks - Batch run tasks.
 * @param {*} data - Initial data for pipe tasks.
 * @return {Promise} The tasks runner promise.
 *
 * @example
 * const task = new Task((resolve, reject, n) => resolve(n * 2));
 * pipe([task, task, task], 2).then(result => console.log(result)); // 16
 */
export default (tasks, data) => {
  if(!Array.isArray(tasks)) {
    throw new TypeError();
  }

  if(tasks.some(task => !(task instanceof Task))) {
    throw new TypeError();
  }

  return new Promise((resolve) => {
    let task;
    let result = data;

    (async () => {
      while(task = tasks.shift()) {
        result = await task.run(result);
      }

      resolve(result);
    })();
  });
};
