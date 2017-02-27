import Task from './task';
import Stream from './stream';
import Scheduler from './scheduler';

const queue = (tasks, ...params) => {
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

const pipe = (tasks, data) => {
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

const all = (tasks, ...params) => {
  if(!Array.isArray(tasks)) {
    throw new TypeError();
  }

  if(tasks.some(task => !(task instanceof Task))) {
    throw new TypeError();
  }

  return Promise.all(tasks.map(task => task.run(...params)));
};

const hash = (tasksHash, ...params) => {
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

export default {
  hash,
  queue,
  all,
  pipe,
  Task,
  Scheduler,
  Stream
};
