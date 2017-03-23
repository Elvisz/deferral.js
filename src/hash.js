import Task from './task';

/**
 * Batch run hash tasks.
 * @param {object} tasksHash - Batch run tasks.
 * @param {...*} params - Parameters for batch tasks.
 * @return {Promise} The tasks runner promise.
 *
 * @example
 * const task = new Task((resolve, reject) => resolve('test'));
 * hash({ a: task, b: task, c: task }).then(result => console.log(result)); // { a: 'test', b: 'test', c: 'test' }
 */
export default (tasksHash, ...params) => {
  if(typeof tasksHash === 'object' && tasksHash.constructor === Object) {
    const keys = Object.keys(tasksHash);

    if(Object.values(tasksHash).some(task => !(task instanceof Task))) {
      throw new TypeError();
    }

    return Promise
      .all(keys.map(key => tasksHash[key].run(...params)))
      .then(results => keys.reduce((map, key, index) => {
        map[key] = results[index];
        return map;
      }, {}));
  }

  throw new TypeError();
};
