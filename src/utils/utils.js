const isPlainObject = suspect => typeof suspect === 'object' && suspect.constructor === Object;

const isAyncFunction = suspect => typeof suspect === 'function' && (suspect.constructor.name === 'AsyncFunction' || (async function () {}).constructor == suspect.constructor);

const isPromise = suspect => suspect instanceof Promise;

const isArray = Array.isArray;

const zip = (keys, values) => keys.reduce((map, key, index) => {
  map[key] = values[index];

  return map;
}, {});

export default {
  zip,
  isArray,
  isPromise,
  isPlainObject,
  isAyncFunction
};
