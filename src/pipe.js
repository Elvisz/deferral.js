import { isArray, isAyncFunction } from './utils/utils';
import { NOT_A_ASYNC_FUNCTION, NOT_A_ARRAY } from './config/errors';

/**
 * A sequential async functions runner, return a Promise that the last resolve of the async function.
 * If one of async function raise an error, the runner will stop and return Promise.reject(reason).
 * Each async function resolve will be the next one parameter.
 *
 * @param {AsyncFunction[]} asyncs - Async functions.
 * @param {*} data - Initial data of async functions pipe.
 * @return {Promise}
 *
 * @example
 * const task1 = async data => date + 1;
 * const task2 = async data => await new Promise(r => setTimeout(() => r(data + 2), 400));
 * const task2 = async data => await new Promise.reject(null);
 *
 * pipe([task1, task2], 0).then(result => console.log(result)); // 3
 *
 * pipe([task3, task1], 0).catch(result => console.log(result)); // null
 */
export default (asyncs, data) => {
  if(!isArray(asyncs)) {
    throw NOT_A_ARRAY;
  }

  return (async () => {
    let func;
    let result = data;

    while(func = asyncs.shift()) {
      try {
        result = await func(result);
      } catch(error) {
        return error;
      }
    }

    return result;
  })();
};
