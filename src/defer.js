import { isPromise, isAyncFunction } from './utils/utils';
import { NOT_A_ASYNC_FUNCTION, NOT_A_PROMISE } from './config/errors';

/**
 * A deferal runner, return a Promise that resolves after given promise resolved.
 * @param {AsyncFunction} asyncfn - Async function.
 * @param {Promise} after - async function will run after the Promise is resolved, default is Promise.resolve().
 * @return {Promise}
 *
 * @example
 * const task = async (test = 'test') => `${test} of task`;
 * const promise = new Promise(resolve => setTimeout(() => resolve(), 3000));
 *
 * defer(task, promise); // console return `test if task` after 3 seconds.
 */
export default (asyncfn, after = Promise.resolve()) => {
  if(!isAyncFunction(asyncfn)) {
    throw NOT_A_ASYNC_FUNCTION;
  }

  if(!isPromise(after)) {
    throw NOT_A_PROMISE;
  }

  return after.then(() => asyncfn());
};
