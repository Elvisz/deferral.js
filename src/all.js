import Task from './task';

/**
 * Batch run tasks.
 * @param {Task[]} tasks - Batch run tasks.
 * @param {...*} params - Parameters for batch tasks.
 * @return {Promise} The tasks runner promise.
 *
 * @example
 * const task = new Task((resolve, reject) => resolve('test'));
 * all([task, task, task]).then(result => console.log(result)); // ['test', 'test', 'test']
 */
export default (tasks, ...params) => {
  if(!Array.isArray(tasks)) {
    throw new TypeError();
  }

  if(tasks.some(task => !(task instanceof Task))) {
    throw new TypeError();
  }

  return Promise.all(tasks.map(task => task.run(...params)));
};
