import TaskWrapper from './task-wrapper';

const _timer = Symbol('timer');

export default class Stream {
  constructor(mode = 'debounce', period = 400, immediately = false) {
    Object.defineProperties(this, {
      mode: {
        value: mode // debounce or throttle
      },

      period: {
        value: period // millisecond
      },

      immediately: {
        value: immediately // false as default
      }
    });
  }

  run(task, ...params) {
    const taskWrapper = new TaskWrapper(task, ...params);
    const mode = this.mode;
    const period = this.period;
    const immediately = this.immediately;

    if(immediately && !this[_timer]) {
      taskWrapper.run();
    }

    if(mode === 'throttle') {
      if(this[_timer]) {
        return TaskWrapper;
      }
    }

    if(mode === 'debounce') {
      clearTimeout(this[_timer]);
    }

    this[_timer] = setTimeout(() => {
      if(!immediately) {
        taskWrapper.run();
      }

      this[_timer] = null;
    }, period);

    return taskWrapper;
  }
}
