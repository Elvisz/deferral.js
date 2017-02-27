const REG_EXECUTOR = /\(\s*resolve\s*,\s*reject[^)]*\)[\s\S]+(resolve|reject)\s*(\([\s\S]*\))*/;
const _executor = Symbol('executor');
const _context = Symbol('context');

export default class Task {
  constructor(executor) {
    if(REG_EXECUTOR.test(executor.toString())) {
      this[_executor] = executor;
    } else {
      throw TypeError('Task constructor requires a parameter which like a Promise executor.');
    }
  }

  run(...args) {
    return new Promise((resolve, reject) => this[_executor].apply(this[_context], [resolve, reject].concat(args)));
  }

  bind(context) {
    this[_context] = context;
    return this;
  }
}
