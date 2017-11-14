import { isArray, isAyncFunction } from './utils/utils';
import { NOT_A_ASYNC_FUNCTION, NOT_A_ARRAY } from './config/errors';

/**
 * A concurrent async functions runner, return a Promise that resolves when all of the tasks have resolved, like Promise.all().
 * @param {AsyncFunction[]} asyncs - Async functions.
 * @param {...*} params - Parameters for async functions.
 * @return {Promise}
 *
 * @example
 * const task1 = async (test = 'test') => `${test} of task 1`;
 * const task2 = async (test = 'test') => `${test} of task 2`;
 * const task3 = async (test = 'test') => `${test} of task 3`;
 *
 * all([task1, task2, task3]).then(result => console.log(result)); // ['test of task 1', 'test of task 2', 'test of task 3']
 *
 * all([task1, task2, task3], 'hello').then(result => console.log(result)); // ['hello of task 1', 'hello of task 2', 'hello of task 3']
 */
export default (asyncs, ...params) => {
  if(!isArray(asyncs)) {
    throw NOT_A_ARRAY;
  }

  return Promise.all(asyncs.map(func => isAyncFunction(func) ? func(...params) : Promise.reject(NOT_A_ASYNC_FUNCTION)));
};
