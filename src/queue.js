import Task from './task';

/**
 * Batch run tasks one by once.
 * @param {Task[]} tasks - Batch run tasks.
 * @param {...*} params - Parameters for batch tasks.
 * @return {Promise} The tasks runner promise.
 *
 * @example
 * const start = new Date();
 * const task = new Task((resolve, reject) => setTimeout(resolve, 200));
 * queue([task, task, task]).then(() => console.log(new Date() - start)); // about 600
 */
export default (tasks, ...params) => {
  if(!Array.isArray(tasks)) {
    throw new TypeError();
  }

  if(tasks.some(task => !(task instanceof Task))) {
    throw new TypeError();
  }

  return new Promise((resolve) => {
    const result = [];
    let task;

    (async () => {
      while(task = tasks.shift()) {
        const ret = await task.run(...params);
        result.push(ret);
      }

      resolve(result);
    })();
  });
};
