import { zip, isPlainObject } from './utils/utils';
import { NOT_A_PLAIN_OBJECT } from './config/errors';
import all from './all';

/**
 * A concurrent async functions runner, return a Promise that resolves when all of the tasks have resolved, return the keys and results.
 * @param {Object} asyncs - Async functions.
 * @param {...*} params - Parameters for async functions.
 * @return {Promise}
 *
 * @example
 * const task1 = async (test = 'test') => `${test} of task 1`;
 * const task2 = async (test = 'test') => `${test} of task 2`;
 * const task3 = async (test = 'test') => `${test} of task 3`;
 *
 * hash({ task1, task2, task3 }).then(result => console.log(result)); // { task1: 'test of task 1', task2: 'test of task 2', task3: 'test of task 3' }
 *
 * hash({ task1, task2, task3 }, 'hello').then(result => console.log(result)); // { task1: 'hello of task 1', task2: 'hello of task 2', task3: 'hello of task 3' }
 */
export default (asyncs, ...params) => {
  if(!isPlainObject(asyncs)) {
    throw NOT_A_PLAIN_OBJECT;
  }

  return all(Object.values(asyncs)).then(results => zip(Object.keys(asyncs), results));
};
