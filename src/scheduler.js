import TaskWrapper from './task-wrapper';

const _after = Symbol('after');
const _queue = Symbol('queue');
const _done = Symbol('done');
const _defferal = Symbol('defferal');

export default class Scheduler {
  constructor(queue, after = Promise.resolve()) {
    if(!Array.isArray(queue)) {
      throw TypeError();
    }

    if(arguments.length > 1 && !(after instanceof Promise)) {
      throw TypeError();
    }

    Object.assign(this, {
      [_after]: after,
      [_done]: () => {},

      [_queue]: queue.reduce((map, node) => {
        let name;
        let unique;
        let once;

        if(typeof node === 'string') {
          name = node;
          unique = false;
          once = false;
        }

        if(typeof node === 'object' && node.constructor === Object) {
          name = node.name;
          unique = node.unique;
          once = node.once;
        }

        return map.set(name, {
          unique,
          once,
          tasks: []
        });
      }, new Map())
    });
  }

  [_defferal]() {
    this.running = true;
    this[_after].then(() => {
      (async () => {
        const names = [...this[_queue].keys()];
        const results = [];
        let name;

        while(name = names.shift()) {
          const { tasks, unique, once } = this[_queue].get(name);
          const set = new Set();
          let _tasks = tasks;

          if(unique || once) {
            // if requires unique, keep the latest task.
            // if requires once, keep the first task.
            _tasks = (once ? tasks : tasks.reverse()).filter((taskWrapper) => {
              if(!set.has(taskWrapper.task)) {
                set.add(taskWrapper.task);
                return true;
              }

              return false;
            });
            _tasks = once ? _tasks : _tasks.reverse();
          }

          await Promise.all(_tasks.map(wrapper => wrapper.run())).then((result) => {
            // clear scheduled tasks
            tasks.length = 0;

            // save the result
            results.push(result);
          });
        }

        this.running = false;
        this[_done](results);
      })();
    });
  }

  after(after) {
    if(!(after instanceof Promise)) {
      throw TypeError();
    }

    this[_after] = after;
  }

  done(done) {
    if(typeof done !== 'function') {
      throw new TypeError();
    }

    this[_done] = done;
  }

  add(task, to, ...params) {
    const wrap = new TaskWrapper(task, ...params);

    if(this[_queue].has(to)) {
      const batch = this[_queue].get(to);
      const tasks = batch.tasks;

      if(!this.running) {
        this[_defferal]();
      }

      tasks.push(wrap);
      return wrap;
    }

    throw new Error(`[${to}] queue is not exist!`);
  }
}
