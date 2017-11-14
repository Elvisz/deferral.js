import { isArray, isAyncFunction } from './utils/utils';
import { NOT_A_ASYNC_FUNCTION, NOT_A_ARRAY } from './config/errors';

/**
 * A concurrent async functions runner, return a Promise that resolves or rejects as soon as one of the async function resolves or rejects, with the value or reason from that async function, like Promise.race().
 * @param {AsyncFunction[]} asyncs - Async functions.
 * @param {...*} params - Parameters for async functions.
 * @return {Promise}
 *
 * @example
 * const task1 = async () => await new Promise(r => setTimeout(() => r('task 1 resolved'), 400));
 * const task2 = async () => await new Promise(r => setTimeout(() => r('task 2 resolved'), 200));
 * const task3 = async () => await new Promise(r => setTimeout(() => r('task 3 resolved'), 600));
 *
 * race([task1, task2, task3]).then(result => console.log(result)); // task 2 resolved
 */
export default (asyncs, ...params) => {
  if(!isArray(asyncs)) {
    throw NOT_A_ARRAY;
  }

  return Promise.race(asyncs.map(func => isAyncFunction(func) ? func(...params) : Promise.reject(NOT_A_ASYNC_FUNCTION)));
};
