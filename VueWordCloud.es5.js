(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
	typeof define === 'function' && define.amd ? define(['vue'], factory) :
	(global.VueWordCloud = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? _ctx(out, _global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var f$1 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$1
};

var isEnum = _objectPie.f;
var _objectToArray = function (isEntries) {
  return function (it) {
    var O = _toIobject(it);
    var keys = _objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

// https://github.com/tc39/proposal-object-values-entries

var $entries = _objectToArray(true);

_export(_export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

var entries$1 = _core.Object.entries;

var entries = createCommonjsModule(function (module) {
module.exports = { "default": entries$1, __esModule: true };
});

var _Object$entries = unwrapExports(entries);

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _redefine = _hide;

var _iterators = {};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

'use strict';



var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

'use strict';









var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

'use strict';
var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

'use strict';



var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

'use strict';









_export(_export.S + _export.F * !_iterDetect(function (iter) {  }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

var from$2 = _core.Array.from;

var from = createCommonjsModule(function (module) {
module.exports = { "default": from$2, __esModule: true };
});

unwrapExports(from);

var toConsumableArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _from2 = _interopRequireDefault(from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var runtime = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = 'object' === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);
});

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

var runtimeModule = runtime;

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

var regenerator = runtimeModule;

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

'use strict';





// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

var TO_STRING_TAG = _wks('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
  _iterators[NAME] = _iterators.Array;
}

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var _forOf = createCommonjsModule(function (module) {
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
  var f = _ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = _iterCall(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

var process$1 = _global.process;
var setTask = _global.setImmediate;
var clearTask = _global.clearImmediate;
var MessageChannel = _global.MessageChannel;
var Dispatch = _global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (_cof(process$1) == 'process') {
    defer = function (id) {
      process$1.nextTick(_ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(_ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = _ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
    defer = function (id) {
      _global.postMessage(id + '', '*');
    };
    _global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
    defer = function (id) {
      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
        _html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(_ctx(run, id, 1), 0);
    };
  }
}
var _task = {
  set: setTask,
  clear: clearTask
};

var macrotask = _task.set;
var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
var process$2 = _global.process;
var Promise$1 = _global.Promise;
var isNode$1 = _cof(process$2) == 'process';

var _microtask = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode$1 && (parent = process$2.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode$1) {
    notify = function () {
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise$1 && Promise$1.resolve) {
    var promise = Promise$1.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(_global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

'use strict';
// 25.4.1.5 NewPromiseCapability(C)


function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = _aFunction(resolve);
  this.reject = _aFunction(reject);
}

var f$2 = function (C) {
  return new PromiseCapability(C);
};

var _newPromiseCapability = {
	f: f$2
};

var _perform = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

var _promiseResolve = function (C, x) {
  _anObject(C);
  if (_isObject(x) && x.constructor === C) return x;
  var promiseCapability = _newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else _hide(target, key, src[key]);
  } return target;
};

'use strict';




var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

'use strict';










var task = _task.set;
var microtask = _microtask();



var PROMISE = 'Promise';
var TypeError$1 = _global.TypeError;
var process = _global.process;
var $Promise = _global[PROMISE];
var isNode = _classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal;
var newGenericPromiseCapability;
var OwnPromiseCapability;
var Wrapper;
var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(_global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = _perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = _global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = _global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c;
  var i = 0;
  var reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  } return true;
};
var onHandleUnhandled = function (promise) {
  task.call(_global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = _global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    _anInstance(this, $Promise, PROMISE, '_h');
    _aFunction(executor);
    Internal.call(this);
    try {
      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = _ctx($resolve, promise, 1);
    this.reject = _ctx($reject, promise, 1);
  };
  _newPromiseCapability.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
_export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
_export(_export.S + _export.F * (_library || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
  }
});
_export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = _perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      _forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = _perform(function () {
      _forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

// https://github.com/tc39/proposal-promise-finally
'use strict';






_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return _promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return _promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

'use strict';
// https://github.com/tc39/proposal-promise-try




_export(_export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = _newPromiseCapability.f(this);
  var result = _perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

var promise$1 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$1, __esModule: true };
});

var _Promise = unwrapExports(promise);

var asyncToGenerator = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _promise2 = _interopRequireDefault(promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var core_getIterator = _core.getIterator = function (it) {
  var iterFn = core_getIteratorMethod(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return _anObject(iterFn.call(it));
};

var getIterator$1 = core_getIterator;

var getIterator = createCommonjsModule(function (module) {
module.exports = { "default": getIterator$1, __esModule: true };
});

var _getIterator = unwrapExports(getIterator);

var ITERATOR$4 = _wks('iterator');

var core_isIterable = _core.isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$4] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || _iterators.hasOwnProperty(_classof(O));
};

var isIterable$2 = core_isIterable;

var isIterable = createCommonjsModule(function (module) {
module.exports = { "default": isIterable$2, __esModule: true };
});

unwrapExports(isIterable);

var slicedToArray = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _isIterable3 = _interopRequireDefault(isIterable);



var _getIterator3 = _interopRequireDefault(getIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
});

var _slicedToArray = unwrapExports(slicedToArray);

var f$3 = _wks;

var _wksExt = {
	f: f$3
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

unwrapExports(iterator);

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

var f$4 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$4
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$6 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$6
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$1 = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$5
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$7 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD$1(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$7
};

'use strict';
// ECMAScript 6 symbols shim





var META = _meta.KEY;


















var gOPD = _objectGopd.f;
var dP$1 = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE$2 = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum$1 = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto$1 = Object[PROTOTYPE$2];
var USE_NATIVE$1 = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP$1({}, 'a', {
    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto$1, key);
  if (protoDesc) delete ObjectProto$1[key];
  dP$1(it, key, D);
  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
} : dP$1;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE$1 && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP$1(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum$1.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto$1;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE$1) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto$1) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE$1, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE$1, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE$1 || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !_isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var symbol$2 = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": symbol$2, __esModule: true };
});

unwrapExports(symbol);

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _iterator2 = _interopRequireDefault(iterator);



var _symbol2 = _interopRequireDefault(symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

// most Object methods by ES6 should accept primitives



var _objectSap = function (KEY, exec) {
  var fn = (_core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
};

// 19.1.2.9 Object.getPrototypeOf(O)



_objectSap('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return _objectGpo(_toObject(it));
  };
});

var getPrototypeOf$1 = _core.Object.getPrototypeOf;

var getPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": getPrototypeOf$1, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

// 19.1.3.19 Object.setPrototypeOf(O, proto)

_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

var setPrototypeOf$2 = _core.Object.setPrototypeOf;

var setPrototypeOf = createCommonjsModule(function (module) {
module.exports = { "default": setPrototypeOf$2, __esModule: true };
});

unwrapExports(setPrototypeOf);

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
_export(_export.S, 'Object', { create: _objectCreate });

var $Object = _core.Object;
var create$3 = function create(P, D) {
  return $Object.create(P, D);
};

var create$1 = createCommonjsModule(function (module) {
module.exports = { "default": create$3, __esModule: true };
});

unwrapExports(create$1);

var inherits = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;



var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf);



var _create2 = _interopRequireDefault(create$1);



var _typeof3 = _interopRequireDefault(_typeof_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits = unwrapExports(inherits);

var _class = function (_Error) {
	_inherits(_class, _Error);

	function _class() {
		var _ref;

		_classCallCheck(this, _class);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || _Object$getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

		_this.name = 'InterruptError';
		return _this;
	}

	return _class;
}(Error);

var Worker_getMessage = function (worker) {
	return new _Promise(function (resolve, reject) {
		var cleanUp = void 0;
		var messageHandler = function messageHandler(event) {
			cleanUp(event);
			resolve(event.data);
		};
		var errorHandler = function errorHandler(event) {
			cleanUp(event);
			reject(event);
		};
		cleanUp = function cleanUp(event) {
			event.preventDefault();
			worker.removeEventListener('message', messageHandler);
			worker.removeEventListener('error', errorHandler);
		};
		worker.addEventListener('message', messageHandler);
		worker.addEventListener('error', errorHandler);
	});
};

var Promise_delay = function () {
	var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

	return new _Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
};

var _validateCollection = function (it, TYPE) {
  if (!_isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

'use strict';
var dP$2 = _objectDp.f;









var fastKey = _meta.fastKey;

var SIZE = _descriptors ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

var _collectionStrong = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      _anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = _objectCreate(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
    });
    _redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = _validateCollection(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        _validateCollection(this, NAME);
        var f = _ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(_validateCollection(this, NAME), key);
      }
    });
    if (_descriptors) dP$2(C.prototype, 'size', {
      get: function () {
        return _validateCollection(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    _iterDefine(C, NAME, function (iterated, kind) {
      this._t = _validateCollection(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return _iterStep(1);
      }
      // return step by kind
      if (kind == 'keys') return _iterStep(0, entry.k);
      if (kind == 'values') return _iterStep(0, entry.v);
      return _iterStep(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    _setSpecies(NAME);
  }
};

var SPECIES$2 = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES$2];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

'use strict';










var dP$3 = _objectDp.f;
var each = _arrayMethods(0);


var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = _global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  if (!_descriptors || typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    _redefineAll(C.prototype, methods);
    _meta.NEED = true;
  } else {
    C = wrapper(function (target, iterable) {
      _anInstance(target, C, NAME, '_c');
      target._c = new Base();
      if (iterable != undefined) _forOf(iterable, IS_MAP, target[ADDER], target);
    });
    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) _hide(C.prototype, KEY, function (a, b) {
        _anInstance(this, C, KEY);
        if (!IS_ADDER && IS_WEAK && !_isObject(a)) return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    IS_WEAK || dP$3(C.prototype, 'size', {
      get: function () {
        return this._c.size;
      }
    });
  }

  _setToStringTag(C, NAME);

  O[NAME] = C;
  _export(_export.G + _export.W + _export.F, O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

'use strict';


var SET = 'Set';

// 23.2 Set Objects
var es6_set = _collection(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
  }
}, _collectionStrong);

var _arrayFromIterable = function (iter, ITERATOR) {
  var result = [];
  _forOf(iter, false, result.push, result, ITERATOR);
  return result;
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


var _collectionToJson = function (NAME) {
  return function toJSON() {
    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
    return _arrayFromIterable(this);
  };
};

// https://github.com/DavidBruant/Map-Set.prototype.toJSON


_export(_export.P + _export.R, 'Set', { toJSON: _collectionToJson('Set') });

'use strict';
// https://tc39.github.io/proposal-setmap-offrom/


var _setCollectionOf = function (COLLECTION) {
  _export(_export.S, COLLECTION, { of: function of() {
    var length = arguments.length;
    var A = Array(length);
    while (length--) A[length] = arguments[length];
    return new this(A);
  } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
_setCollectionOf('Set');

'use strict';
// https://tc39.github.io/proposal-setmap-offrom/





var _setCollectionFrom = function (COLLECTION) {
  _export(_export.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
    var mapFn = arguments[1];
    var mapping, A, n, cb;
    _aFunction(this);
    mapping = mapFn !== undefined;
    if (mapping) _aFunction(mapFn);
    if (source == undefined) return new this();
    A = [];
    if (mapping) {
      n = 0;
      cb = _ctx(mapFn, arguments[2], 2);
      _forOf(source, false, function (nextItem) {
        A.push(cb(nextItem, n++));
      });
    } else {
      _forOf(source, false, A.push, A);
    }
    return new this(A);
  } });
};

// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
_setCollectionFrom('Set');

var set$1 = _core.Set;

var set = createCommonjsModule(function (module) {
module.exports = { "default": set$1, __esModule: true };
});

var _Set = unwrapExports(set);

var Array_uniqueBy = function (array, iteratee) {
	var uniqueValues = new _Set();
	return array.filter(function (value) {
		value = iteratee(value);
		if (uniqueValues.has(value)) {
			return false;
		}
		uniqueValues.add(value);
		return true;
	});
};

var Iterable_min = function (values, iteratee) {
	var returns = Infinity;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _getIterator(values), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var value = _step.value;

			returns = Math.min(iteratee(value), returns);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return returns;
};

var Iterable_max = function (values, iteratee) {
	var returns = -Infinity;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _getIterator(values), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var value = _step.value;

			returns = Math.max(iteratee(value), returns);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return returns;
};

var Math_convertTurnToRad = function (v) {
	return v * 2 * Math.PI;
};

var boundWordWorkerContent = URL.createObjectURL(new Blob(["(function () {\n'use strict';\n\nfunction unwrapExports (x) {\n\treturn x && x.__esModule ? x['default'] : x;\n}\n\nfunction createCommonjsModule(fn, module) {\n\treturn module = { exports: {} }, fn(module, module.exports), module.exports;\n}\n\n// 7.1.4 ToInteger\nvar ceil = Math.ceil;\nvar floor = Math.floor;\nvar _toInteger = function (it) {\n  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);\n};\n\n// 7.2.1 RequireObjectCoercible(argument)\nvar _defined = function (it) {\n  if (it == undefined) throw TypeError(\"Can't call method on  \" + it);\n  return it;\n};\n\n// true  -> String#at\n// false -> String#codePointAt\nvar _stringAt = function (TO_STRING) {\n  return function (that, pos) {\n    var s = String(_defined(that));\n    var i = _toInteger(pos);\n    var l = s.length;\n    var a, b;\n    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;\n    a = s.charCodeAt(i);\n    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff\n      ? TO_STRING ? s.charAt(i) : a\n      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;\n  };\n};\n\nvar _library = true;\n\nvar _global = createCommonjsModule(function (module) {\n// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028\nvar global = module.exports = typeof window != 'undefined' && window.Math == Math\n  ? window : typeof self != 'undefined' && self.Math == Math ? self\n  // eslint-disable-next-line no-new-func\n  : Function('return this')();\nif (typeof __g == 'number') __g = global; // eslint-disable-line no-undef\n});\n\nvar _core = createCommonjsModule(function (module) {\nvar core = module.exports = { version: '2.5.1' };\nif (typeof __e == 'number') __e = core; // eslint-disable-line no-undef\n});\n\nvar _aFunction = function (it) {\n  if (typeof it != 'function') throw TypeError(it + ' is not a function!');\n  return it;\n};\n\n// optional / simple context binding\n\nvar _ctx = function (fn, that, length) {\n  _aFunction(fn);\n  if (that === undefined) return fn;\n  switch (length) {\n    case 1: return function (a) {\n      return fn.call(that, a);\n    };\n    case 2: return function (a, b) {\n      return fn.call(that, a, b);\n    };\n    case 3: return function (a, b, c) {\n      return fn.call(that, a, b, c);\n    };\n  }\n  return function (/* ...args */) {\n    return fn.apply(that, arguments);\n  };\n};\n\nvar _isObject = function (it) {\n  return typeof it === 'object' ? it !== null : typeof it === 'function';\n};\n\nvar _anObject = function (it) {\n  if (!_isObject(it)) throw TypeError(it + ' is not an object!');\n  return it;\n};\n\nvar _fails = function (exec) {\n  try {\n    return !!exec();\n  } catch (e) {\n    return true;\n  }\n};\n\n// Thank's IE8 for his funny defineProperty\nvar _descriptors = !_fails(function () {\n  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;\n});\n\nvar document$1 = _global.document;\n// typeof document.createElement is 'object' in old IE\nvar is = _isObject(document$1) && _isObject(document$1.createElement);\nvar _domCreate = function (it) {\n  return is ? document$1.createElement(it) : {};\n};\n\nvar _ie8DomDefine = !_descriptors && !_fails(function () {\n  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;\n});\n\n// 7.1.1 ToPrimitive(input [, PreferredType])\n\n// instead of the ES6 spec version, we didn't implement @@toPrimitive case\n// and the second argument - flag - preferred type is a string\nvar _toPrimitive = function (it, S) {\n  if (!_isObject(it)) return it;\n  var fn, val;\n  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;\n  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;\n  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;\n  throw TypeError(\"Can't convert object to primitive value\");\n};\n\nvar dP = Object.defineProperty;\n\nvar f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {\n  _anObject(O);\n  P = _toPrimitive(P, true);\n  _anObject(Attributes);\n  if (_ie8DomDefine) try {\n    return dP(O, P, Attributes);\n  } catch (e) { /* empty */ }\n  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');\n  if ('value' in Attributes) O[P] = Attributes.value;\n  return O;\n};\n\nvar _objectDp = {\n\tf: f\n};\n\nvar _propertyDesc = function (bitmap, value) {\n  return {\n    enumerable: !(bitmap & 1),\n    configurable: !(bitmap & 2),\n    writable: !(bitmap & 4),\n    value: value\n  };\n};\n\nvar _hide = _descriptors ? function (object, key, value) {\n  return _objectDp.f(object, key, _propertyDesc(1, value));\n} : function (object, key, value) {\n  object[key] = value;\n  return object;\n};\n\nvar PROTOTYPE = 'prototype';\n\nvar $export = function (type, name, source) {\n  var IS_FORCED = type & $export.F;\n  var IS_GLOBAL = type & $export.G;\n  var IS_STATIC = type & $export.S;\n  var IS_PROTO = type & $export.P;\n  var IS_BIND = type & $export.B;\n  var IS_WRAP = type & $export.W;\n  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});\n  var expProto = exports[PROTOTYPE];\n  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];\n  var key, own, out;\n  if (IS_GLOBAL) source = name;\n  for (key in source) {\n    // contains in native\n    own = !IS_FORCED && target && target[key] !== undefined;\n    if (own && key in exports) continue;\n    // export native or passed\n    out = own ? target[key] : source[key];\n    // prevent global pollution for namespaces\n    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]\n    // bind timers to global for call from export context\n    : IS_BIND && own ? _ctx(out, _global)\n    // wrap global constructors for prevent change them in library\n    : IS_WRAP && target[key] == out ? (function (C) {\n      var F = function (a, b, c) {\n        if (this instanceof C) {\n          switch (arguments.length) {\n            case 0: return new C();\n            case 1: return new C(a);\n            case 2: return new C(a, b);\n          } return new C(a, b, c);\n        } return C.apply(this, arguments);\n      };\n      F[PROTOTYPE] = C[PROTOTYPE];\n      return F;\n    // make static versions for prototype methods\n    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;\n    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%\n    if (IS_PROTO) {\n      (exports.virtual || (exports.virtual = {}))[key] = out;\n      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%\n      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);\n    }\n  }\n};\n// type bitmap\n$export.F = 1;   // forced\n$export.G = 2;   // global\n$export.S = 4;   // static\n$export.P = 8;   // proto\n$export.B = 16;  // bind\n$export.W = 32;  // wrap\n$export.U = 64;  // safe\n$export.R = 128; // real proto method for `library`\nvar _export = $export;\n\nvar _redefine = _hide;\n\nvar hasOwnProperty = {}.hasOwnProperty;\nvar _has = function (it, key) {\n  return hasOwnProperty.call(it, key);\n};\n\nvar _iterators = {};\n\nvar toString = {}.toString;\n\nvar _cof = function (it) {\n  return toString.call(it).slice(8, -1);\n};\n\n// fallback for non-array-like ES3 and non-enumerable old V8 strings\n\n// eslint-disable-next-line no-prototype-builtins\nvar _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {\n  return _cof(it) == 'String' ? it.split('') : Object(it);\n};\n\n// to indexed object, toObject with fallback for non-array-like ES3 strings\n\n\nvar _toIobject = function (it) {\n  return _iobject(_defined(it));\n};\n\n// 7.1.15 ToLength\n\nvar min = Math.min;\nvar _toLength = function (it) {\n  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991\n};\n\nvar max = Math.max;\nvar min$1 = Math.min;\nvar _toAbsoluteIndex = function (index, length) {\n  index = _toInteger(index);\n  return index < 0 ? max(index + length, 0) : min$1(index, length);\n};\n\n// false -> Array#indexOf\n// true  -> Array#includes\n\n\n\nvar _arrayIncludes = function (IS_INCLUDES) {\n  return function ($this, el, fromIndex) {\n    var O = _toIobject($this);\n    var length = _toLength(O.length);\n    var index = _toAbsoluteIndex(fromIndex, length);\n    var value;\n    // Array#includes uses SameValueZero equality algorithm\n    // eslint-disable-next-line no-self-compare\n    if (IS_INCLUDES && el != el) while (length > index) {\n      value = O[index++];\n      // eslint-disable-next-line no-self-compare\n      if (value != value) return true;\n    // Array#indexOf ignores holes, Array#includes - not\n    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {\n      if (O[index] === el) return IS_INCLUDES || index || 0;\n    } return !IS_INCLUDES && -1;\n  };\n};\n\nvar SHARED = '__core-js_shared__';\nvar store = _global[SHARED] || (_global[SHARED] = {});\nvar _shared = function (key) {\n  return store[key] || (store[key] = {});\n};\n\nvar id = 0;\nvar px = Math.random();\nvar _uid = function (key) {\n  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));\n};\n\nvar shared = _shared('keys');\n\nvar _sharedKey = function (key) {\n  return shared[key] || (shared[key] = _uid(key));\n};\n\nvar arrayIndexOf = _arrayIncludes(false);\nvar IE_PROTO$1 = _sharedKey('IE_PROTO');\n\nvar _objectKeysInternal = function (object, names) {\n  var O = _toIobject(object);\n  var i = 0;\n  var result = [];\n  var key;\n  for (key in O) if (key != IE_PROTO$1) _has(O, key) && result.push(key);\n  // Don't enum bug & hidden keys\n  while (names.length > i) if (_has(O, key = names[i++])) {\n    ~arrayIndexOf(result, key) || result.push(key);\n  }\n  return result;\n};\n\n// IE 8- don't enum bug keys\nvar _enumBugKeys = (\n  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'\n).split(',');\n\n// 19.1.2.14 / 15.2.3.14 Object.keys(O)\n\n\n\nvar _objectKeys = Object.keys || function keys(O) {\n  return _objectKeysInternal(O, _enumBugKeys);\n};\n\nvar _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {\n  _anObject(O);\n  var keys = _objectKeys(Properties);\n  var length = keys.length;\n  var i = 0;\n  var P;\n  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);\n  return O;\n};\n\nvar document$2 = _global.document;\nvar _html = document$2 && document$2.documentElement;\n\n// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])\n\n\n\nvar IE_PROTO = _sharedKey('IE_PROTO');\nvar Empty = function () { /* empty */ };\nvar PROTOTYPE$1 = 'prototype';\n\n// Create object with fake `null` prototype: use iframe Object with cleared prototype\nvar createDict = function () {\n  // Thrash, waste and sodomy: IE GC bug\n  var iframe = _domCreate('iframe');\n  var i = _enumBugKeys.length;\n  var lt = '<';\n  var gt = '>';\n  var iframeDocument;\n  iframe.style.display = 'none';\n  _html.appendChild(iframe);\n  iframe.src = 'javascript:'; // eslint-disable-line no-script-url\n  // createDict = iframe.contentWindow.Object;\n  // html.removeChild(iframe);\n  iframeDocument = iframe.contentWindow.document;\n  iframeDocument.open();\n  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);\n  iframeDocument.close();\n  createDict = iframeDocument.F;\n  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];\n  return createDict();\n};\n\nvar _objectCreate = Object.create || function create(O, Properties) {\n  var result;\n  if (O !== null) {\n    Empty[PROTOTYPE$1] = _anObject(O);\n    result = new Empty();\n    Empty[PROTOTYPE$1] = null;\n    // add \"__proto__\" for Object.getPrototypeOf polyfill\n    result[IE_PROTO] = O;\n  } else result = createDict();\n  return Properties === undefined ? result : _objectDps(result, Properties);\n};\n\nvar _wks = createCommonjsModule(function (module) {\nvar store = _shared('wks');\n\nvar Symbol = _global.Symbol;\nvar USE_SYMBOL = typeof Symbol == 'function';\n\nvar $exports = module.exports = function (name) {\n  return store[name] || (store[name] =\n    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));\n};\n\n$exports.store = store;\n});\n\nvar def = _objectDp.f;\n\nvar TAG = _wks('toStringTag');\n\nvar _setToStringTag = function (it, tag, stat) {\n  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });\n};\n\n'use strict';\n\n\n\nvar IteratorPrototype = {};\n\n// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()\n_hide(IteratorPrototype, _wks('iterator'), function () { return this; });\n\nvar _iterCreate = function (Constructor, NAME, next) {\n  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });\n  _setToStringTag(Constructor, NAME + ' Iterator');\n};\n\n// 7.1.13 ToObject(argument)\n\nvar _toObject = function (it) {\n  return Object(_defined(it));\n};\n\n// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)\n\n\nvar IE_PROTO$2 = _sharedKey('IE_PROTO');\nvar ObjectProto = Object.prototype;\n\nvar _objectGpo = Object.getPrototypeOf || function (O) {\n  O = _toObject(O);\n  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];\n  if (typeof O.constructor == 'function' && O instanceof O.constructor) {\n    return O.constructor.prototype;\n  } return O instanceof Object ? ObjectProto : null;\n};\n\n'use strict';\n\n\n\n\n\n\n\n\n\nvar ITERATOR = _wks('iterator');\nvar BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`\nvar FF_ITERATOR = '@@iterator';\nvar KEYS = 'keys';\nvar VALUES = 'values';\n\nvar returnThis = function () { return this; };\n\nvar _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {\n  _iterCreate(Constructor, NAME, next);\n  var getMethod = function (kind) {\n    if (!BUGGY && kind in proto) return proto[kind];\n    switch (kind) {\n      case KEYS: return function keys() { return new Constructor(this, kind); };\n      case VALUES: return function values() { return new Constructor(this, kind); };\n    } return function entries() { return new Constructor(this, kind); };\n  };\n  var TAG = NAME + ' Iterator';\n  var DEF_VALUES = DEFAULT == VALUES;\n  var VALUES_BUG = false;\n  var proto = Base.prototype;\n  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];\n  var $default = $native || getMethod(DEFAULT);\n  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;\n  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;\n  var methods, key, IteratorPrototype;\n  // Fix native\n  if ($anyNative) {\n    IteratorPrototype = _objectGpo($anyNative.call(new Base()));\n    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {\n      // Set @@toStringTag to native iterators\n      _setToStringTag(IteratorPrototype, TAG, true);\n      // fix for some old engines\n      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);\n    }\n  }\n  // fix Array#{values, @@iterator}.name in V8 / FF\n  if (DEF_VALUES && $native && $native.name !== VALUES) {\n    VALUES_BUG = true;\n    $default = function values() { return $native.call(this); };\n  }\n  // Define iterator\n  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {\n    _hide(proto, ITERATOR, $default);\n  }\n  // Plug for library\n  _iterators[NAME] = $default;\n  _iterators[TAG] = returnThis;\n  if (DEFAULT) {\n    methods = {\n      values: DEF_VALUES ? $default : getMethod(VALUES),\n      keys: IS_SET ? $default : getMethod(KEYS),\n      entries: $entries\n    };\n    if (FORCED) for (key in methods) {\n      if (!(key in proto)) _redefine(proto, key, methods[key]);\n    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);\n  }\n  return methods;\n};\n\n'use strict';\nvar $at = _stringAt(true);\n\n// 21.1.3.27 String.prototype[@@iterator]()\n_iterDefine(String, 'String', function (iterated) {\n  this._t = String(iterated); // target\n  this._i = 0;                // next index\n// 21.1.5.2.1 %StringIteratorPrototype%.next()\n}, function () {\n  var O = this._t;\n  var index = this._i;\n  var point;\n  if (index >= O.length) return { value: undefined, done: true };\n  point = $at(O, index);\n  this._i += point.length;\n  return { value: point, done: false };\n});\n\nvar _iterStep = function (done, value) {\n  return { value: value, done: !!done };\n};\n\n'use strict';\n\n\n\n\n\n// 22.1.3.4 Array.prototype.entries()\n// 22.1.3.13 Array.prototype.keys()\n// 22.1.3.29 Array.prototype.values()\n// 22.1.3.30 Array.prototype[@@iterator]()\nvar es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {\n  this._t = _toIobject(iterated); // target\n  this._i = 0;                   // next index\n  this._k = kind;                // kind\n// 22.1.5.2.1 %ArrayIteratorPrototype%.next()\n}, function () {\n  var O = this._t;\n  var kind = this._k;\n  var index = this._i++;\n  if (!O || index >= O.length) {\n    this._t = undefined;\n    return _iterStep(1);\n  }\n  if (kind == 'keys') return _iterStep(0, index);\n  if (kind == 'values') return _iterStep(0, O[index]);\n  return _iterStep(0, [index, O[index]]);\n}, 'values');\n\n// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)\n_iterators.Arguments = _iterators.Array;\n\nvar TO_STRING_TAG = _wks('toStringTag');\n\nvar DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +\n  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +\n  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +\n  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +\n  'TextTrackList,TouchList').split(',');\n\nfor (var i = 0; i < DOMIterables.length; i++) {\n  var NAME = DOMIterables[i];\n  var Collection = _global[NAME];\n  var proto = Collection && Collection.prototype;\n  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);\n  _iterators[NAME] = _iterators.Array;\n}\n\nvar f$1 = _wks;\n\nvar _wksExt = {\n\tf: f$1\n};\n\nvar iterator$2 = _wksExt.f('iterator');\n\nvar iterator = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": iterator$2, __esModule: true };\n});\n\nunwrapExports(iterator);\n\nvar _meta = createCommonjsModule(function (module) {\nvar META = _uid('meta');\n\n\nvar setDesc = _objectDp.f;\nvar id = 0;\nvar isExtensible = Object.isExtensible || function () {\n  return true;\n};\nvar FREEZE = !_fails(function () {\n  return isExtensible(Object.preventExtensions({}));\n});\nvar setMeta = function (it) {\n  setDesc(it, META, { value: {\n    i: 'O' + ++id, // object ID\n    w: {}          // weak collections IDs\n  } });\n};\nvar fastKey = function (it, create) {\n  // return primitive with prefix\n  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;\n  if (!_has(it, META)) {\n    // can't set metadata to uncaught frozen object\n    if (!isExtensible(it)) return 'F';\n    // not necessary to add metadata\n    if (!create) return 'E';\n    // add missing metadata\n    setMeta(it);\n  // return object ID\n  } return it[META].i;\n};\nvar getWeak = function (it, create) {\n  if (!_has(it, META)) {\n    // can't set metadata to uncaught frozen object\n    if (!isExtensible(it)) return true;\n    // not necessary to add metadata\n    if (!create) return false;\n    // add missing metadata\n    setMeta(it);\n  // return hash weak collections IDs\n  } return it[META].w;\n};\n// add metadata on freeze-family methods calling\nvar onFreeze = function (it) {\n  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);\n  return it;\n};\nvar meta = module.exports = {\n  KEY: META,\n  NEED: false,\n  fastKey: fastKey,\n  getWeak: getWeak,\n  onFreeze: onFreeze\n};\n});\n\nvar defineProperty = _objectDp.f;\nvar _wksDefine = function (name) {\n  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});\n  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });\n};\n\nvar f$2 = Object.getOwnPropertySymbols;\n\nvar _objectGops = {\n\tf: f$2\n};\n\nvar f$3 = {}.propertyIsEnumerable;\n\nvar _objectPie = {\n\tf: f$3\n};\n\n// all enumerable object keys, includes symbols\n\n\n\nvar _enumKeys = function (it) {\n  var result = _objectKeys(it);\n  var getSymbols = _objectGops.f;\n  if (getSymbols) {\n    var symbols = getSymbols(it);\n    var isEnum = _objectPie.f;\n    var i = 0;\n    var key;\n    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);\n  } return result;\n};\n\n// 7.2.2 IsArray(argument)\n\nvar _isArray = Array.isArray || function isArray(arg) {\n  return _cof(arg) == 'Array';\n};\n\n// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)\n\nvar hiddenKeys = _enumBugKeys.concat('length', 'prototype');\n\nvar f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {\n  return _objectKeysInternal(O, hiddenKeys);\n};\n\nvar _objectGopn = {\n\tf: f$5\n};\n\n// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window\n\nvar gOPN$1 = _objectGopn.f;\nvar toString$1 = {}.toString;\n\nvar windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames\n  ? Object.getOwnPropertyNames(window) : [];\n\nvar getWindowNames = function (it) {\n  try {\n    return gOPN$1(it);\n  } catch (e) {\n    return windowNames.slice();\n  }\n};\n\nvar f$4 = function getOwnPropertyNames(it) {\n  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));\n};\n\nvar _objectGopnExt = {\n\tf: f$4\n};\n\nvar gOPD$1 = Object.getOwnPropertyDescriptor;\n\nvar f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {\n  O = _toIobject(O);\n  P = _toPrimitive(P, true);\n  if (_ie8DomDefine) try {\n    return gOPD$1(O, P);\n  } catch (e) { /* empty */ }\n  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);\n};\n\nvar _objectGopd = {\n\tf: f$6\n};\n\n'use strict';\n// ECMAScript 6 symbols shim\n\n\n\n\n\nvar META = _meta.KEY;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar gOPD = _objectGopd.f;\nvar dP$1 = _objectDp.f;\nvar gOPN = _objectGopnExt.f;\nvar $Symbol = _global.Symbol;\nvar $JSON = _global.JSON;\nvar _stringify = $JSON && $JSON.stringify;\nvar PROTOTYPE$2 = 'prototype';\nvar HIDDEN = _wks('_hidden');\nvar TO_PRIMITIVE = _wks('toPrimitive');\nvar isEnum = {}.propertyIsEnumerable;\nvar SymbolRegistry = _shared('symbol-registry');\nvar AllSymbols = _shared('symbols');\nvar OPSymbols = _shared('op-symbols');\nvar ObjectProto$1 = Object[PROTOTYPE$2];\nvar USE_NATIVE = typeof $Symbol == 'function';\nvar QObject = _global.QObject;\n// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173\nvar setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;\n\n// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687\nvar setSymbolDesc = _descriptors && _fails(function () {\n  return _objectCreate(dP$1({}, 'a', {\n    get: function () { return dP$1(this, 'a', { value: 7 }).a; }\n  })).a != 7;\n}) ? function (it, key, D) {\n  var protoDesc = gOPD(ObjectProto$1, key);\n  if (protoDesc) delete ObjectProto$1[key];\n  dP$1(it, key, D);\n  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);\n} : dP$1;\n\nvar wrap = function (tag) {\n  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);\n  sym._k = tag;\n  return sym;\n};\n\nvar isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {\n  return typeof it == 'symbol';\n} : function (it) {\n  return it instanceof $Symbol;\n};\n\nvar $defineProperty = function defineProperty(it, key, D) {\n  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);\n  _anObject(it);\n  key = _toPrimitive(key, true);\n  _anObject(D);\n  if (_has(AllSymbols, key)) {\n    if (!D.enumerable) {\n      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));\n      it[HIDDEN][key] = true;\n    } else {\n      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;\n      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });\n    } return setSymbolDesc(it, key, D);\n  } return dP$1(it, key, D);\n};\nvar $defineProperties = function defineProperties(it, P) {\n  _anObject(it);\n  var keys = _enumKeys(P = _toIobject(P));\n  var i = 0;\n  var l = keys.length;\n  var key;\n  while (l > i) $defineProperty(it, key = keys[i++], P[key]);\n  return it;\n};\nvar $create = function create(it, P) {\n  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);\n};\nvar $propertyIsEnumerable = function propertyIsEnumerable(key) {\n  var E = isEnum.call(this, key = _toPrimitive(key, true));\n  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;\n  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;\n};\nvar $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {\n  it = _toIobject(it);\n  key = _toPrimitive(key, true);\n  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;\n  var D = gOPD(it, key);\n  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;\n  return D;\n};\nvar $getOwnPropertyNames = function getOwnPropertyNames(it) {\n  var names = gOPN(_toIobject(it));\n  var result = [];\n  var i = 0;\n  var key;\n  while (names.length > i) {\n    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);\n  } return result;\n};\nvar $getOwnPropertySymbols = function getOwnPropertySymbols(it) {\n  var IS_OP = it === ObjectProto$1;\n  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));\n  var result = [];\n  var i = 0;\n  var key;\n  while (names.length > i) {\n    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);\n  } return result;\n};\n\n// 19.4.1.1 Symbol([description])\nif (!USE_NATIVE) {\n  $Symbol = function Symbol() {\n    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');\n    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);\n    var $set = function (value) {\n      if (this === ObjectProto$1) $set.call(OPSymbols, value);\n      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;\n      setSymbolDesc(this, tag, _propertyDesc(1, value));\n    };\n    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });\n    return wrap(tag);\n  };\n  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {\n    return this._k;\n  });\n\n  _objectGopd.f = $getOwnPropertyDescriptor;\n  _objectDp.f = $defineProperty;\n  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;\n  _objectPie.f = $propertyIsEnumerable;\n  _objectGops.f = $getOwnPropertySymbols;\n\n  if (_descriptors && !_library) {\n    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);\n  }\n\n  _wksExt.f = function (name) {\n    return wrap(_wks(name));\n  };\n}\n\n_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });\n\nfor (var es6Symbols = (\n  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14\n  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'\n).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);\n\nfor (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);\n\n_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {\n  // 19.4.2.1 Symbol.for(key)\n  'for': function (key) {\n    return _has(SymbolRegistry, key += '')\n      ? SymbolRegistry[key]\n      : SymbolRegistry[key] = $Symbol(key);\n  },\n  // 19.4.2.5 Symbol.keyFor(sym)\n  keyFor: function keyFor(sym) {\n    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');\n    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;\n  },\n  useSetter: function () { setter = true; },\n  useSimple: function () { setter = false; }\n});\n\n_export(_export.S + _export.F * !USE_NATIVE, 'Object', {\n  // 19.1.2.2 Object.create(O [, Properties])\n  create: $create,\n  // 19.1.2.4 Object.defineProperty(O, P, Attributes)\n  defineProperty: $defineProperty,\n  // 19.1.2.3 Object.defineProperties(O, Properties)\n  defineProperties: $defineProperties,\n  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)\n  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,\n  // 19.1.2.7 Object.getOwnPropertyNames(O)\n  getOwnPropertyNames: $getOwnPropertyNames,\n  // 19.1.2.8 Object.getOwnPropertySymbols(O)\n  getOwnPropertySymbols: $getOwnPropertySymbols\n});\n\n// 24.3.2 JSON.stringify(value [, replacer [, space]])\n$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {\n  var S = $Symbol();\n  // MS Edge converts symbol values to JSON as {}\n  // WebKit converts symbol values to JSON as null\n  // V8 throws on boxed symbols\n  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';\n})), 'JSON', {\n  stringify: function stringify(it) {\n    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined\n    var args = [it];\n    var i = 1;\n    var replacer, $replacer;\n    while (arguments.length > i) args.push(arguments[i++]);\n    replacer = args[1];\n    if (typeof replacer == 'function') $replacer = replacer;\n    if ($replacer || !_isArray(replacer)) replacer = function (key, value) {\n      if ($replacer) value = $replacer.call(this, key, value);\n      if (!isSymbol(value)) return value;\n    };\n    args[1] = replacer;\n    return _stringify.apply($JSON, args);\n  }\n});\n\n// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)\n$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);\n// 19.4.3.5 Symbol.prototype[@@toStringTag]\n_setToStringTag($Symbol, 'Symbol');\n// 20.2.1.9 Math[@@toStringTag]\n_setToStringTag(Math, 'Math', true);\n// 24.3.3 JSON[@@toStringTag]\n_setToStringTag(_global.JSON, 'JSON', true);\n\n_wksDefine('asyncIterator');\n\n_wksDefine('observable');\n\nvar symbol$2 = _core.Symbol;\n\nvar symbol = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": symbol$2, __esModule: true };\n});\n\nunwrapExports(symbol);\n\nvar _typeof_1 = createCommonjsModule(function (module, exports) {\n\"use strict\";\n\nexports.__esModule = true;\n\n\n\nvar _iterator2 = _interopRequireDefault(iterator);\n\n\n\nvar _symbol2 = _interopRequireDefault(symbol);\n\nvar _typeof = typeof _symbol2.default === \"function\" && typeof _iterator2.default === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === \"function\" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? \"symbol\" : typeof obj; };\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = typeof _symbol2.default === \"function\" && _typeof(_iterator2.default) === \"symbol\" ? function (obj) {\n  return typeof obj === \"undefined\" ? \"undefined\" : _typeof(obj);\n} : function (obj) {\n  return obj && typeof _symbol2.default === \"function\" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? \"symbol\" : typeof obj === \"undefined\" ? \"undefined\" : _typeof(obj);\n};\n});\n\nvar _typeof = unwrapExports(_typeof_1);\n\n// getting tag from 19.1.3.6 Object.prototype.toString()\n\nvar TAG$1 = _wks('toStringTag');\n// ES3 wrong here\nvar ARG = _cof(function () { return arguments; }()) == 'Arguments';\n\n// fallback for IE11 Script Access Denied error\nvar tryGet = function (it, key) {\n  try {\n    return it[key];\n  } catch (e) { /* empty */ }\n};\n\nvar _classof = function (it) {\n  var O, T, B;\n  return it === undefined ? 'Undefined' : it === null ? 'Null'\n    // @@toStringTag case\n    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T\n    // builtinTag case\n    : ARG ? _cof(O)\n    // ES3 arguments fallback\n    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;\n};\n\nvar ITERATOR$1 = _wks('iterator');\n\nvar core_getIteratorMethod = _core.getIteratorMethod = function (it) {\n  if (it != undefined) return it[ITERATOR$1]\n    || it['@@iterator']\n    || _iterators[_classof(it)];\n};\n\nvar core_getIterator = _core.getIterator = function (it) {\n  var iterFn = core_getIteratorMethod(it);\n  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');\n  return _anObject(iterFn.call(it));\n};\n\nvar getIterator$1 = core_getIterator;\n\nvar getIterator = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": getIterator$1, __esModule: true };\n});\n\nvar _getIterator = unwrapExports(getIterator);\n\nvar ITERATOR$2 = _wks('iterator');\n\nvar core_isIterable = _core.isIterable = function (it) {\n  var O = Object(it);\n  return O[ITERATOR$2] !== undefined\n    || '@@iterator' in O\n    // eslint-disable-next-line no-prototype-builtins\n    || _iterators.hasOwnProperty(_classof(O));\n};\n\nvar isIterable$2 = core_isIterable;\n\nvar isIterable = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": isIterable$2, __esModule: true };\n});\n\nunwrapExports(isIterable);\n\nvar slicedToArray = createCommonjsModule(function (module, exports) {\n\"use strict\";\n\nexports.__esModule = true;\n\n\n\nvar _isIterable3 = _interopRequireDefault(isIterable);\n\n\n\nvar _getIterator3 = _interopRequireDefault(getIterator);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function () {\n  function sliceIterator(arr, i) {\n    var _arr = [];\n    var _n = true;\n    var _d = false;\n    var _e = undefined;\n\n    try {\n      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {\n        _arr.push(_s.value);\n\n        if (i && _arr.length === i) break;\n      }\n    } catch (err) {\n      _d = true;\n      _e = err;\n    } finally {\n      try {\n        if (!_n && _i[\"return\"]) _i[\"return\"]();\n      } finally {\n        if (_d) throw _e;\n      }\n    }\n\n    return _arr;\n  }\n\n  return function (arr, i) {\n    if (Array.isArray(arr)) {\n      return arr;\n    } else if ((0, _isIterable3.default)(Object(arr))) {\n      return sliceIterator(arr, i);\n    } else {\n      throw new TypeError(\"Invalid attempt to destructure non-iterable instance\");\n    }\n  };\n}();\n});\n\nvar _slicedToArray = unwrapExports(slicedToArray);\n\nvar _anInstance = function (it, Constructor, name, forbiddenField) {\n  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {\n    throw TypeError(name + ': incorrect invocation!');\n  } return it;\n};\n\n// call something on iterator step with safe closing on error\n\nvar _iterCall = function (iterator, fn, value, entries) {\n  try {\n    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);\n  // 7.4.6 IteratorClose(iterator, completion)\n  } catch (e) {\n    var ret = iterator['return'];\n    if (ret !== undefined) _anObject(ret.call(iterator));\n    throw e;\n  }\n};\n\n// check on default Array iterator\n\nvar ITERATOR$3 = _wks('iterator');\nvar ArrayProto = Array.prototype;\n\nvar _isArrayIter = function (it) {\n  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$3] === it);\n};\n\nvar _forOf = createCommonjsModule(function (module) {\nvar BREAK = {};\nvar RETURN = {};\nvar exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {\n  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);\n  var f = _ctx(fn, that, entries ? 2 : 1);\n  var index = 0;\n  var length, step, iterator, result;\n  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');\n  // fast case for arrays with default iterator\n  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {\n    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);\n    if (result === BREAK || result === RETURN) return result;\n  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {\n    result = _iterCall(iterator, f, step.value, entries);\n    if (result === BREAK || result === RETURN) return result;\n  }\n};\nexports.BREAK = BREAK;\nexports.RETURN = RETURN;\n});\n\n// 7.3.20 SpeciesConstructor(O, defaultConstructor)\n\n\nvar SPECIES = _wks('species');\nvar _speciesConstructor = function (O, D) {\n  var C = _anObject(O).constructor;\n  var S;\n  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);\n};\n\n// fast apply, http://jsperf.lnkit.com/fast-apply/5\nvar _invoke = function (fn, args, that) {\n  var un = that === undefined;\n  switch (args.length) {\n    case 0: return un ? fn()\n                      : fn.call(that);\n    case 1: return un ? fn(args[0])\n                      : fn.call(that, args[0]);\n    case 2: return un ? fn(args[0], args[1])\n                      : fn.call(that, args[0], args[1]);\n    case 3: return un ? fn(args[0], args[1], args[2])\n                      : fn.call(that, args[0], args[1], args[2]);\n    case 4: return un ? fn(args[0], args[1], args[2], args[3])\n                      : fn.call(that, args[0], args[1], args[2], args[3]);\n  } return fn.apply(that, args);\n};\n\nvar process$1 = _global.process;\nvar setTask = _global.setImmediate;\nvar clearTask = _global.clearImmediate;\nvar MessageChannel = _global.MessageChannel;\nvar Dispatch = _global.Dispatch;\nvar counter = 0;\nvar queue = {};\nvar ONREADYSTATECHANGE = 'onreadystatechange';\nvar defer;\nvar channel;\nvar port;\nvar run = function () {\n  var id = +this;\n  // eslint-disable-next-line no-prototype-builtins\n  if (queue.hasOwnProperty(id)) {\n    var fn = queue[id];\n    delete queue[id];\n    fn();\n  }\n};\nvar listener = function (event) {\n  run.call(event.data);\n};\n// Node.js 0.9+ & IE10+ has setImmediate, otherwise:\nif (!setTask || !clearTask) {\n  setTask = function setImmediate(fn) {\n    var args = [];\n    var i = 1;\n    while (arguments.length > i) args.push(arguments[i++]);\n    queue[++counter] = function () {\n      // eslint-disable-next-line no-new-func\n      _invoke(typeof fn == 'function' ? fn : Function(fn), args);\n    };\n    defer(counter);\n    return counter;\n  };\n  clearTask = function clearImmediate(id) {\n    delete queue[id];\n  };\n  // Node.js 0.8-\n  if (_cof(process$1) == 'process') {\n    defer = function (id) {\n      process$1.nextTick(_ctx(run, id, 1));\n    };\n  // Sphere (JS game engine) Dispatch API\n  } else if (Dispatch && Dispatch.now) {\n    defer = function (id) {\n      Dispatch.now(_ctx(run, id, 1));\n    };\n  // Browsers with MessageChannel, includes WebWorkers\n  } else if (MessageChannel) {\n    channel = new MessageChannel();\n    port = channel.port2;\n    channel.port1.onmessage = listener;\n    defer = _ctx(port.postMessage, port, 1);\n  // Browsers with postMessage, skip WebWorkers\n  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'\n  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {\n    defer = function (id) {\n      _global.postMessage(id + '', '*');\n    };\n    _global.addEventListener('message', listener, false);\n  // IE8-\n  } else if (ONREADYSTATECHANGE in _domCreate('script')) {\n    defer = function (id) {\n      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {\n        _html.removeChild(this);\n        run.call(id);\n      };\n    };\n  // Rest old browsers\n  } else {\n    defer = function (id) {\n      setTimeout(_ctx(run, id, 1), 0);\n    };\n  }\n}\nvar _task = {\n  set: setTask,\n  clear: clearTask\n};\n\nvar macrotask = _task.set;\nvar Observer = _global.MutationObserver || _global.WebKitMutationObserver;\nvar process$2 = _global.process;\nvar Promise$1 = _global.Promise;\nvar isNode$1 = _cof(process$2) == 'process';\n\nvar _microtask = function () {\n  var head, last, notify;\n\n  var flush = function () {\n    var parent, fn;\n    if (isNode$1 && (parent = process$2.domain)) parent.exit();\n    while (head) {\n      fn = head.fn;\n      head = head.next;\n      try {\n        fn();\n      } catch (e) {\n        if (head) notify();\n        else last = undefined;\n        throw e;\n      }\n    } last = undefined;\n    if (parent) parent.enter();\n  };\n\n  // Node.js\n  if (isNode$1) {\n    notify = function () {\n      process$2.nextTick(flush);\n    };\n  // browsers with MutationObserver\n  } else if (Observer) {\n    var toggle = true;\n    var node = document.createTextNode('');\n    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new\n    notify = function () {\n      node.data = toggle = !toggle;\n    };\n  // environments with maybe non-completely correct, but existent Promise\n  } else if (Promise$1 && Promise$1.resolve) {\n    var promise = Promise$1.resolve();\n    notify = function () {\n      promise.then(flush);\n    };\n  // for other environments - macrotask based on:\n  // - setImmediate\n  // - MessageChannel\n  // - window.postMessag\n  // - onreadystatechange\n  // - setTimeout\n  } else {\n    notify = function () {\n      // strange IE + webpack dev server bug - use .call(global)\n      macrotask.call(_global, flush);\n    };\n  }\n\n  return function (fn) {\n    var task = { fn: fn, next: undefined };\n    if (last) last.next = task;\n    if (!head) {\n      head = task;\n      notify();\n    } last = task;\n  };\n};\n\n'use strict';\n// 25.4.1.5 NewPromiseCapability(C)\n\n\nfunction PromiseCapability(C) {\n  var resolve, reject;\n  this.promise = new C(function ($$resolve, $$reject) {\n    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');\n    resolve = $$resolve;\n    reject = $$reject;\n  });\n  this.resolve = _aFunction(resolve);\n  this.reject = _aFunction(reject);\n}\n\nvar f$7 = function (C) {\n  return new PromiseCapability(C);\n};\n\nvar _newPromiseCapability = {\n\tf: f$7\n};\n\nvar _perform = function (exec) {\n  try {\n    return { e: false, v: exec() };\n  } catch (e) {\n    return { e: true, v: e };\n  }\n};\n\nvar _promiseResolve = function (C, x) {\n  _anObject(C);\n  if (_isObject(x) && x.constructor === C) return x;\n  var promiseCapability = _newPromiseCapability.f(C);\n  var resolve = promiseCapability.resolve;\n  resolve(x);\n  return promiseCapability.promise;\n};\n\nvar _redefineAll = function (target, src, safe) {\n  for (var key in src) {\n    if (safe && target[key]) target[key] = src[key];\n    else _hide(target, key, src[key]);\n  } return target;\n};\n\n'use strict';\n\n\n\n\nvar SPECIES$1 = _wks('species');\n\nvar _setSpecies = function (KEY) {\n  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];\n  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {\n    configurable: true,\n    get: function () { return this; }\n  });\n};\n\nvar ITERATOR$4 = _wks('iterator');\nvar SAFE_CLOSING = false;\n\ntry {\n  var riter = [7][ITERATOR$4]();\n  riter['return'] = function () { SAFE_CLOSING = true; };\n  // eslint-disable-next-line no-throw-literal\n  \n} catch (e) { /* empty */ }\n\nvar _iterDetect = function (exec, skipClosing) {\n  if (!skipClosing && !SAFE_CLOSING) return false;\n  var safe = false;\n  try {\n    var arr = [7];\n    var iter = arr[ITERATOR$4]();\n    iter.next = function () { return { done: safe = true }; };\n    arr[ITERATOR$4] = function () { return iter; };\n    exec(arr);\n  } catch (e) { /* empty */ }\n  return safe;\n};\n\n'use strict';\n\n\n\n\n\n\n\n\n\n\nvar task = _task.set;\nvar microtask = _microtask();\n\n\n\nvar PROMISE = 'Promise';\nvar TypeError$1 = _global.TypeError;\nvar process = _global.process;\nvar $Promise = _global[PROMISE];\nvar isNode = _classof(process) == 'process';\nvar empty = function () { /* empty */ };\nvar Internal;\nvar newGenericPromiseCapability;\nvar OwnPromiseCapability;\nvar Wrapper;\nvar newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;\n\nvar USE_NATIVE$1 = !!function () {\n  try {\n    // correct subclassing with @@species support\n    var promise = $Promise.resolve(1);\n    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {\n      exec(empty, empty);\n    };\n    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test\n    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;\n  } catch (e) { /* empty */ }\n}();\n\n// helpers\nvar isThenable = function (it) {\n  var then;\n  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;\n};\nvar notify = function (promise, isReject) {\n  if (promise._n) return;\n  promise._n = true;\n  var chain = promise._c;\n  microtask(function () {\n    var value = promise._v;\n    var ok = promise._s == 1;\n    var i = 0;\n    var run = function (reaction) {\n      var handler = ok ? reaction.ok : reaction.fail;\n      var resolve = reaction.resolve;\n      var reject = reaction.reject;\n      var domain = reaction.domain;\n      var result, then;\n      try {\n        if (handler) {\n          if (!ok) {\n            if (promise._h == 2) onHandleUnhandled(promise);\n            promise._h = 1;\n          }\n          if (handler === true) result = value;\n          else {\n            if (domain) domain.enter();\n            result = handler(value);\n            if (domain) domain.exit();\n          }\n          if (result === reaction.promise) {\n            reject(TypeError$1('Promise-chain cycle'));\n          } else if (then = isThenable(result)) {\n            then.call(result, resolve, reject);\n          } else resolve(result);\n        } else reject(value);\n      } catch (e) {\n        reject(e);\n      }\n    };\n    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach\n    promise._c = [];\n    promise._n = false;\n    if (isReject && !promise._h) onUnhandled(promise);\n  });\n};\nvar onUnhandled = function (promise) {\n  task.call(_global, function () {\n    var value = promise._v;\n    var unhandled = isUnhandled(promise);\n    var result, handler, console;\n    if (unhandled) {\n      result = _perform(function () {\n        if (isNode) {\n          process.emit('unhandledRejection', value, promise);\n        } else if (handler = _global.onunhandledrejection) {\n          handler({ promise: promise, reason: value });\n        } else if ((console = _global.console) && console.error) {\n          console.error('Unhandled promise rejection', value);\n        }\n      });\n      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should\n      promise._h = isNode || isUnhandled(promise) ? 2 : 1;\n    } promise._a = undefined;\n    if (unhandled && result.e) throw result.v;\n  });\n};\nvar isUnhandled = function (promise) {\n  if (promise._h == 1) return false;\n  var chain = promise._a || promise._c;\n  var i = 0;\n  var reaction;\n  while (chain.length > i) {\n    reaction = chain[i++];\n    if (reaction.fail || !isUnhandled(reaction.promise)) return false;\n  } return true;\n};\nvar onHandleUnhandled = function (promise) {\n  task.call(_global, function () {\n    var handler;\n    if (isNode) {\n      process.emit('rejectionHandled', promise);\n    } else if (handler = _global.onrejectionhandled) {\n      handler({ promise: promise, reason: promise._v });\n    }\n  });\n};\nvar $reject = function (value) {\n  var promise = this;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  promise._v = value;\n  promise._s = 2;\n  if (!promise._a) promise._a = promise._c.slice();\n  notify(promise, true);\n};\nvar $resolve = function (value) {\n  var promise = this;\n  var then;\n  if (promise._d) return;\n  promise._d = true;\n  promise = promise._w || promise; // unwrap\n  try {\n    if (promise === value) throw TypeError$1(\"Promise can't be resolved itself\");\n    if (then = isThenable(value)) {\n      microtask(function () {\n        var wrapper = { _w: promise, _d: false }; // wrap\n        try {\n          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));\n        } catch (e) {\n          $reject.call(wrapper, e);\n        }\n      });\n    } else {\n      promise._v = value;\n      promise._s = 1;\n      notify(promise, false);\n    }\n  } catch (e) {\n    $reject.call({ _w: promise, _d: false }, e); // wrap\n  }\n};\n\n// constructor polyfill\nif (!USE_NATIVE$1) {\n  // 25.4.3.1 Promise(executor)\n  $Promise = function Promise(executor) {\n    _anInstance(this, $Promise, PROMISE, '_h');\n    _aFunction(executor);\n    Internal.call(this);\n    try {\n      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));\n    } catch (err) {\n      $reject.call(this, err);\n    }\n  };\n  // eslint-disable-next-line no-unused-vars\n  Internal = function Promise(executor) {\n    this._c = [];             // <- awaiting reactions\n    this._a = undefined;      // <- checked in isUnhandled reactions\n    this._s = 0;              // <- state\n    this._d = false;          // <- done\n    this._v = undefined;      // <- value\n    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled\n    this._n = false;          // <- notify\n  };\n  Internal.prototype = _redefineAll($Promise.prototype, {\n    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)\n    then: function then(onFulfilled, onRejected) {\n      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));\n      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;\n      reaction.fail = typeof onRejected == 'function' && onRejected;\n      reaction.domain = isNode ? process.domain : undefined;\n      this._c.push(reaction);\n      if (this._a) this._a.push(reaction);\n      if (this._s) notify(this, false);\n      return reaction.promise;\n    },\n    // 25.4.5.1 Promise.prototype.catch(onRejected)\n    'catch': function (onRejected) {\n      return this.then(undefined, onRejected);\n    }\n  });\n  OwnPromiseCapability = function () {\n    var promise = new Internal();\n    this.promise = promise;\n    this.resolve = _ctx($resolve, promise, 1);\n    this.reject = _ctx($reject, promise, 1);\n  };\n  _newPromiseCapability.f = newPromiseCapability = function (C) {\n    return C === $Promise || C === Wrapper\n      ? new OwnPromiseCapability(C)\n      : newGenericPromiseCapability(C);\n  };\n}\n\n_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });\n_setToStringTag($Promise, PROMISE);\n_setSpecies(PROMISE);\nWrapper = _core[PROMISE];\n\n// statics\n_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {\n  // 25.4.4.5 Promise.reject(r)\n  reject: function reject(r) {\n    var capability = newPromiseCapability(this);\n    var $$reject = capability.reject;\n    $$reject(r);\n    return capability.promise;\n  }\n});\n_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {\n  // 25.4.4.6 Promise.resolve(x)\n  resolve: function resolve(x) {\n    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);\n  }\n});\n_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {\n  $Promise.all(iter)['catch'](empty);\n})), PROMISE, {\n  // 25.4.4.1 Promise.all(iterable)\n  all: function all(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var resolve = capability.resolve;\n    var reject = capability.reject;\n    var result = _perform(function () {\n      var values = [];\n      var index = 0;\n      var remaining = 1;\n      _forOf(iterable, false, function (promise) {\n        var $index = index++;\n        var alreadyCalled = false;\n        values.push(undefined);\n        remaining++;\n        C.resolve(promise).then(function (value) {\n          if (alreadyCalled) return;\n          alreadyCalled = true;\n          values[$index] = value;\n          --remaining || resolve(values);\n        }, reject);\n      });\n      --remaining || resolve(values);\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  },\n  // 25.4.4.4 Promise.race(iterable)\n  race: function race(iterable) {\n    var C = this;\n    var capability = newPromiseCapability(C);\n    var reject = capability.reject;\n    var result = _perform(function () {\n      _forOf(iterable, false, function (promise) {\n        C.resolve(promise).then(capability.resolve, reject);\n      });\n    });\n    if (result.e) reject(result.v);\n    return capability.promise;\n  }\n});\n\n// https://github.com/tc39/proposal-promise-finally\n'use strict';\n\n\n\n\n\n\n_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {\n  var C = _speciesConstructor(this, _core.Promise || _global.Promise);\n  var isFunction = typeof onFinally == 'function';\n  return this.then(\n    isFunction ? function (x) {\n      return _promiseResolve(C, onFinally()).then(function () { return x; });\n    } : onFinally,\n    isFunction ? function (e) {\n      return _promiseResolve(C, onFinally()).then(function () { throw e; });\n    } : onFinally\n  );\n} });\n\n'use strict';\n// https://github.com/tc39/proposal-promise-try\n\n\n\n\n_export(_export.S, 'Promise', { 'try': function (callbackfn) {\n  var promiseCapability = _newPromiseCapability.f(this);\n  var result = _perform(callbackfn);\n  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);\n  return promiseCapability.promise;\n} });\n\nvar promise$1 = _core.Promise;\n\nvar promise = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": promise$1, __esModule: true };\n});\n\nvar _Promise = unwrapExports(promise);\n\nvar asyncToGenerator = createCommonjsModule(function (module, exports) {\n\"use strict\";\n\nexports.__esModule = true;\n\n\n\nvar _promise2 = _interopRequireDefault(promise);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function (fn) {\n  return function () {\n    var gen = fn.apply(this, arguments);\n    return new _promise2.default(function (resolve, reject) {\n      function step(key, arg) {\n        try {\n          var info = gen[key](arg);\n          var value = info.value;\n        } catch (error) {\n          reject(error);\n          return;\n        }\n\n        if (info.done) {\n          resolve(value);\n        } else {\n          return _promise2.default.resolve(value).then(function (value) {\n            step(\"next\", value);\n          }, function (err) {\n            step(\"throw\", err);\n          });\n        }\n      }\n\n      return step(\"next\");\n    });\n  };\n};\n});\n\nvar _asyncToGenerator = unwrapExports(asyncToGenerator);\n\nvar classCallCheck = createCommonjsModule(function (module, exports) {\n\"use strict\";\n\nexports.__esModule = true;\n\nexports.default = function (instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n};\n});\n\nvar _classCallCheck = unwrapExports(classCallCheck);\n\n// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)\n_export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });\n\nvar $Object = _core.Object;\nvar defineProperty$3 = function defineProperty(it, key, desc) {\n  return $Object.defineProperty(it, key, desc);\n};\n\nvar defineProperty$1 = createCommonjsModule(function (module) {\nmodule.exports = { \"default\": defineProperty$3, __esModule: true };\n});\n\nunwrapExports(defineProperty$1);\n\nvar createClass = createCommonjsModule(function (module, exports) {\n\"use strict\";\n\nexports.__esModule = true;\n\n\n\nvar _defineProperty2 = _interopRequireDefault(defineProperty$1);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nexports.default = function () {\n  function defineProperties(target, props) {\n    for (var i = 0; i < props.length; i++) {\n      var descriptor = props[i];\n      descriptor.enumerable = descriptor.enumerable || false;\n      descriptor.configurable = true;\n      if (\"value\" in descriptor) descriptor.writable = true;\n      (0, _defineProperty2.default)(target, descriptor.key, descriptor);\n    }\n  }\n\n  return function (Constructor, protoProps, staticProps) {\n    if (protoProps) defineProperties(Constructor.prototype, protoProps);\n    if (staticProps) defineProperties(Constructor, staticProps);\n    return Constructor;\n  };\n}();\n});\n\nvar _createClass = unwrapExports(createClass);\n\nvar runtime = createCommonjsModule(function (module) {\n/**\n * Copyright (c) 2014, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * https://raw.github.com/facebook/regenerator/master/LICENSE file. An\n * additional grant of patent rights can be found in the PATENTS file in\n * the same directory.\n */\n\n!(function(global) {\n  \"use strict\";\n\n  var Op = Object.prototype;\n  var hasOwn = Op.hasOwnProperty;\n  var undefined; // More compressible than void 0.\n  var $Symbol = typeof Symbol === \"function\" ? Symbol : {};\n  var iteratorSymbol = $Symbol.iterator || \"@@iterator\";\n  var asyncIteratorSymbol = $Symbol.asyncIterator || \"@@asyncIterator\";\n  var toStringTagSymbol = $Symbol.toStringTag || \"@@toStringTag\";\n\n  var inModule = 'object' === \"object\";\n  var runtime = global.regeneratorRuntime;\n  if (runtime) {\n    if (inModule) {\n      // If regeneratorRuntime is defined globally and we're in a module,\n      // make the exports object identical to regeneratorRuntime.\n      module.exports = runtime;\n    }\n    // Don't bother evaluating the rest of this file if the runtime was\n    // already defined globally.\n    return;\n  }\n\n  // Define the runtime globally (as expected by generated code) as either\n  // module.exports (if we're in a module) or a new, empty object.\n  runtime = global.regeneratorRuntime = inModule ? module.exports : {};\n\n  function wrap(innerFn, outerFn, self, tryLocsList) {\n    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.\n    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;\n    var generator = Object.create(protoGenerator.prototype);\n    var context = new Context(tryLocsList || []);\n\n    // The ._invoke method unifies the implementations of the .next,\n    // .throw, and .return methods.\n    generator._invoke = makeInvokeMethod(innerFn, self, context);\n\n    return generator;\n  }\n  runtime.wrap = wrap;\n\n  // Try/catch helper to minimize deoptimizations. Returns a completion\n  // record like context.tryEntries[i].completion. This interface could\n  // have been (and was previously) designed to take a closure to be\n  // invoked without arguments, but in all the cases we care about we\n  // already have an existing method we want to call, so there's no need\n  // to create a new function object. We can even get away with assuming\n  // the method takes exactly one argument, since that happens to be true\n  // in every case, so we don't have to touch the arguments object. The\n  // only additional allocation required is the completion record, which\n  // has a stable shape and so hopefully should be cheap to allocate.\n  function tryCatch(fn, obj, arg) {\n    try {\n      return { type: \"normal\", arg: fn.call(obj, arg) };\n    } catch (err) {\n      return { type: \"throw\", arg: err };\n    }\n  }\n\n  var GenStateSuspendedStart = \"suspendedStart\";\n  var GenStateSuspendedYield = \"suspendedYield\";\n  var GenStateExecuting = \"executing\";\n  var GenStateCompleted = \"completed\";\n\n  // Returning this object from the innerFn has the same effect as\n  // breaking out of the dispatch switch statement.\n  var ContinueSentinel = {};\n\n  // Dummy constructor functions that we use as the .constructor and\n  // .constructor.prototype properties for functions that return Generator\n  // objects. For full spec compliance, you may wish to configure your\n  // minifier not to mangle the names of these two functions.\n  function Generator() {}\n  function GeneratorFunction() {}\n  function GeneratorFunctionPrototype() {}\n\n  // This is a polyfill for %IteratorPrototype% for environments that\n  // don't natively support it.\n  var IteratorPrototype = {};\n  IteratorPrototype[iteratorSymbol] = function () {\n    return this;\n  };\n\n  var getProto = Object.getPrototypeOf;\n  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));\n  if (NativeIteratorPrototype &&\n      NativeIteratorPrototype !== Op &&\n      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {\n    // This environment has a native %IteratorPrototype%; use it instead\n    // of the polyfill.\n    IteratorPrototype = NativeIteratorPrototype;\n  }\n\n  var Gp = GeneratorFunctionPrototype.prototype =\n    Generator.prototype = Object.create(IteratorPrototype);\n  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;\n  GeneratorFunctionPrototype.constructor = GeneratorFunction;\n  GeneratorFunctionPrototype[toStringTagSymbol] =\n    GeneratorFunction.displayName = \"GeneratorFunction\";\n\n  // Helper for defining the .next, .throw, and .return methods of the\n  // Iterator interface in terms of a single ._invoke method.\n  function defineIteratorMethods(prototype) {\n    [\"next\", \"throw\", \"return\"].forEach(function(method) {\n      prototype[method] = function(arg) {\n        return this._invoke(method, arg);\n      };\n    });\n  }\n\n  runtime.isGeneratorFunction = function(genFun) {\n    var ctor = typeof genFun === \"function\" && genFun.constructor;\n    return ctor\n      ? ctor === GeneratorFunction ||\n        // For the native GeneratorFunction constructor, the best we can\n        // do is to check its .name property.\n        (ctor.displayName || ctor.name) === \"GeneratorFunction\"\n      : false;\n  };\n\n  runtime.mark = function(genFun) {\n    if (Object.setPrototypeOf) {\n      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);\n    } else {\n      genFun.__proto__ = GeneratorFunctionPrototype;\n      if (!(toStringTagSymbol in genFun)) {\n        genFun[toStringTagSymbol] = \"GeneratorFunction\";\n      }\n    }\n    genFun.prototype = Object.create(Gp);\n    return genFun;\n  };\n\n  // Within the body of any async function, `await x` is transformed to\n  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test\n  // `hasOwn.call(value, \"__await\")` to determine if the yielded value is\n  // meant to be awaited.\n  runtime.awrap = function(arg) {\n    return { __await: arg };\n  };\n\n  function AsyncIterator(generator) {\n    function invoke(method, arg, resolve, reject) {\n      var record = tryCatch(generator[method], generator, arg);\n      if (record.type === \"throw\") {\n        reject(record.arg);\n      } else {\n        var result = record.arg;\n        var value = result.value;\n        if (value &&\n            typeof value === \"object\" &&\n            hasOwn.call(value, \"__await\")) {\n          return Promise.resolve(value.__await).then(function(value) {\n            invoke(\"next\", value, resolve, reject);\n          }, function(err) {\n            invoke(\"throw\", err, resolve, reject);\n          });\n        }\n\n        return Promise.resolve(value).then(function(unwrapped) {\n          // When a yielded Promise is resolved, its final value becomes\n          // the .value of the Promise<{value,done}> result for the\n          // current iteration. If the Promise is rejected, however, the\n          // result for this iteration will be rejected with the same\n          // reason. Note that rejections of yielded Promises are not\n          // thrown back into the generator function, as is the case\n          // when an awaited Promise is rejected. This difference in\n          // behavior between yield and await is important, because it\n          // allows the consumer to decide what to do with the yielded\n          // rejection (swallow it and continue, manually .throw it back\n          // into the generator, abandon iteration, whatever). With\n          // await, by contrast, there is no opportunity to examine the\n          // rejection reason outside the generator function, so the\n          // only option is to throw it from the await expression, and\n          // let the generator function handle the exception.\n          result.value = unwrapped;\n          resolve(result);\n        }, reject);\n      }\n    }\n\n    var previousPromise;\n\n    function enqueue(method, arg) {\n      function callInvokeWithMethodAndArg() {\n        return new Promise(function(resolve, reject) {\n          invoke(method, arg, resolve, reject);\n        });\n      }\n\n      return previousPromise =\n        // If enqueue has been called before, then we want to wait until\n        // all previous Promises have been resolved before calling invoke,\n        // so that results are always delivered in the correct order. If\n        // enqueue has not been called before, then it is important to\n        // call invoke immediately, without waiting on a callback to fire,\n        // so that the async generator function has the opportunity to do\n        // any necessary setup in a predictable way. This predictability\n        // is why the Promise constructor synchronously invokes its\n        // executor callback, and why async functions synchronously\n        // execute code before the first await. Since we implement simple\n        // async functions in terms of async generators, it is especially\n        // important to get this right, even though it requires care.\n        previousPromise ? previousPromise.then(\n          callInvokeWithMethodAndArg,\n          // Avoid propagating failures to Promises returned by later\n          // invocations of the iterator.\n          callInvokeWithMethodAndArg\n        ) : callInvokeWithMethodAndArg();\n    }\n\n    // Define the unified helper method that is used to implement .next,\n    // .throw, and .return (see defineIteratorMethods).\n    this._invoke = enqueue;\n  }\n\n  defineIteratorMethods(AsyncIterator.prototype);\n  AsyncIterator.prototype[asyncIteratorSymbol] = function () {\n    return this;\n  };\n  runtime.AsyncIterator = AsyncIterator;\n\n  // Note that simple async functions are implemented on top of\n  // AsyncIterator objects; they just return a Promise for the value of\n  // the final result produced by the iterator.\n  runtime.async = function(innerFn, outerFn, self, tryLocsList) {\n    var iter = new AsyncIterator(\n      wrap(innerFn, outerFn, self, tryLocsList)\n    );\n\n    return runtime.isGeneratorFunction(outerFn)\n      ? iter // If outerFn is a generator, return the full iterator.\n      : iter.next().then(function(result) {\n          return result.done ? result.value : iter.next();\n        });\n  };\n\n  function makeInvokeMethod(innerFn, self, context) {\n    var state = GenStateSuspendedStart;\n\n    return function invoke(method, arg) {\n      if (state === GenStateExecuting) {\n        throw new Error(\"Generator is already running\");\n      }\n\n      if (state === GenStateCompleted) {\n        if (method === \"throw\") {\n          throw arg;\n        }\n\n        // Be forgiving, per 25.3.3.3.3 of the spec:\n        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume\n        return doneResult();\n      }\n\n      context.method = method;\n      context.arg = arg;\n\n      while (true) {\n        var delegate = context.delegate;\n        if (delegate) {\n          var delegateResult = maybeInvokeDelegate(delegate, context);\n          if (delegateResult) {\n            if (delegateResult === ContinueSentinel) continue;\n            return delegateResult;\n          }\n        }\n\n        if (context.method === \"next\") {\n          // Setting context._sent for legacy support of Babel's\n          // function.sent implementation.\n          context.sent = context._sent = context.arg;\n\n        } else if (context.method === \"throw\") {\n          if (state === GenStateSuspendedStart) {\n            state = GenStateCompleted;\n            throw context.arg;\n          }\n\n          context.dispatchException(context.arg);\n\n        } else if (context.method === \"return\") {\n          context.abrupt(\"return\", context.arg);\n        }\n\n        state = GenStateExecuting;\n\n        var record = tryCatch(innerFn, self, context);\n        if (record.type === \"normal\") {\n          // If an exception is thrown from innerFn, we leave state ===\n          // GenStateExecuting and loop back for another invocation.\n          state = context.done\n            ? GenStateCompleted\n            : GenStateSuspendedYield;\n\n          if (record.arg === ContinueSentinel) {\n            continue;\n          }\n\n          return {\n            value: record.arg,\n            done: context.done\n          };\n\n        } else if (record.type === \"throw\") {\n          state = GenStateCompleted;\n          // Dispatch the exception by looping back around to the\n          // context.dispatchException(context.arg) call above.\n          context.method = \"throw\";\n          context.arg = record.arg;\n        }\n      }\n    };\n  }\n\n  // Call delegate.iterator[context.method](context.arg) and handle the\n  // result, either by returning a { value, done } result from the\n  // delegate iterator, or by modifying context.method and context.arg,\n  // setting context.delegate to null, and returning the ContinueSentinel.\n  function maybeInvokeDelegate(delegate, context) {\n    var method = delegate.iterator[context.method];\n    if (method === undefined) {\n      // A .throw or .return when the delegate iterator has no .throw\n      // method always terminates the yield* loop.\n      context.delegate = null;\n\n      if (context.method === \"throw\") {\n        if (delegate.iterator.return) {\n          // If the delegate iterator has a return method, give it a\n          // chance to clean up.\n          context.method = \"return\";\n          context.arg = undefined;\n          maybeInvokeDelegate(delegate, context);\n\n          if (context.method === \"throw\") {\n            // If maybeInvokeDelegate(context) changed context.method from\n            // \"return\" to \"throw\", let that override the TypeError below.\n            return ContinueSentinel;\n          }\n        }\n\n        context.method = \"throw\";\n        context.arg = new TypeError(\n          \"The iterator does not provide a 'throw' method\");\n      }\n\n      return ContinueSentinel;\n    }\n\n    var record = tryCatch(method, delegate.iterator, context.arg);\n\n    if (record.type === \"throw\") {\n      context.method = \"throw\";\n      context.arg = record.arg;\n      context.delegate = null;\n      return ContinueSentinel;\n    }\n\n    var info = record.arg;\n\n    if (! info) {\n      context.method = \"throw\";\n      context.arg = new TypeError(\"iterator result is not an object\");\n      context.delegate = null;\n      return ContinueSentinel;\n    }\n\n    if (info.done) {\n      // Assign the result of the finished delegate to the temporary\n      // variable specified by delegate.resultName (see delegateYield).\n      context[delegate.resultName] = info.value;\n\n      // Resume execution at the desired location (see delegateYield).\n      context.next = delegate.nextLoc;\n\n      // If context.method was \"throw\" but the delegate handled the\n      // exception, let the outer generator proceed normally. If\n      // context.method was \"next\", forget context.arg since it has been\n      // \"consumed\" by the delegate iterator. If context.method was\n      // \"return\", allow the original .return call to continue in the\n      // outer generator.\n      if (context.method !== \"return\") {\n        context.method = \"next\";\n        context.arg = undefined;\n      }\n\n    } else {\n      // Re-yield the result returned by the delegate method.\n      return info;\n    }\n\n    // The delegate iterator is finished, so forget it and continue with\n    // the outer generator.\n    context.delegate = null;\n    return ContinueSentinel;\n  }\n\n  // Define Generator.prototype.{next,throw,return} in terms of the\n  // unified ._invoke helper method.\n  defineIteratorMethods(Gp);\n\n  Gp[toStringTagSymbol] = \"Generator\";\n\n  // A Generator should always return itself as the iterator object when the\n  // @@iterator function is called on it. Some browsers' implementations of the\n  // iterator prototype chain incorrectly implement this, causing the Generator\n  // object to not be returned from this call. This ensures that doesn't happen.\n  // See https://github.com/facebook/regenerator/issues/274 for more details.\n  Gp[iteratorSymbol] = function() {\n    return this;\n  };\n\n  Gp.toString = function() {\n    return \"[object Generator]\";\n  };\n\n  function pushTryEntry(locs) {\n    var entry = { tryLoc: locs[0] };\n\n    if (1 in locs) {\n      entry.catchLoc = locs[1];\n    }\n\n    if (2 in locs) {\n      entry.finallyLoc = locs[2];\n      entry.afterLoc = locs[3];\n    }\n\n    this.tryEntries.push(entry);\n  }\n\n  function resetTryEntry(entry) {\n    var record = entry.completion || {};\n    record.type = \"normal\";\n    delete record.arg;\n    entry.completion = record;\n  }\n\n  function Context(tryLocsList) {\n    // The root entry object (effectively a try statement without a catch\n    // or a finally block) gives us a place to store values thrown from\n    // locations where there is no enclosing try statement.\n    this.tryEntries = [{ tryLoc: \"root\" }];\n    tryLocsList.forEach(pushTryEntry, this);\n    this.reset(true);\n  }\n\n  runtime.keys = function(object) {\n    var keys = [];\n    for (var key in object) {\n      keys.push(key);\n    }\n    keys.reverse();\n\n    // Rather than returning an object with a next method, we keep\n    // things simple and return the next function itself.\n    return function next() {\n      while (keys.length) {\n        var key = keys.pop();\n        if (key in object) {\n          next.value = key;\n          next.done = false;\n          return next;\n        }\n      }\n\n      // To avoid creating an additional object, we just hang the .value\n      // and .done properties off the next function object itself. This\n      // also ensures that the minifier will not anonymize the function.\n      next.done = true;\n      return next;\n    };\n  };\n\n  function values(iterable) {\n    if (iterable) {\n      var iteratorMethod = iterable[iteratorSymbol];\n      if (iteratorMethod) {\n        return iteratorMethod.call(iterable);\n      }\n\n      if (typeof iterable.next === \"function\") {\n        return iterable;\n      }\n\n      if (!isNaN(iterable.length)) {\n        var i = -1, next = function next() {\n          while (++i < iterable.length) {\n            if (hasOwn.call(iterable, i)) {\n              next.value = iterable[i];\n              next.done = false;\n              return next;\n            }\n          }\n\n          next.value = undefined;\n          next.done = true;\n\n          return next;\n        };\n\n        return next.next = next;\n      }\n    }\n\n    // Return an iterator with no values.\n    return { next: doneResult };\n  }\n  runtime.values = values;\n\n  function doneResult() {\n    return { value: undefined, done: true };\n  }\n\n  Context.prototype = {\n    constructor: Context,\n\n    reset: function(skipTempReset) {\n      this.prev = 0;\n      this.next = 0;\n      // Resetting context._sent for legacy support of Babel's\n      // function.sent implementation.\n      this.sent = this._sent = undefined;\n      this.done = false;\n      this.delegate = null;\n\n      this.method = \"next\";\n      this.arg = undefined;\n\n      this.tryEntries.forEach(resetTryEntry);\n\n      if (!skipTempReset) {\n        for (var name in this) {\n          // Not sure about the optimal order of these conditions:\n          if (name.charAt(0) === \"t\" &&\n              hasOwn.call(this, name) &&\n              !isNaN(+name.slice(1))) {\n            this[name] = undefined;\n          }\n        }\n      }\n    },\n\n    stop: function() {\n      this.done = true;\n\n      var rootEntry = this.tryEntries[0];\n      var rootRecord = rootEntry.completion;\n      if (rootRecord.type === \"throw\") {\n        throw rootRecord.arg;\n      }\n\n      return this.rval;\n    },\n\n    dispatchException: function(exception) {\n      if (this.done) {\n        throw exception;\n      }\n\n      var context = this;\n      function handle(loc, caught) {\n        record.type = \"throw\";\n        record.arg = exception;\n        context.next = loc;\n\n        if (caught) {\n          // If the dispatched exception was caught by a catch block,\n          // then let that catch block handle the exception normally.\n          context.method = \"next\";\n          context.arg = undefined;\n        }\n\n        return !! caught;\n      }\n\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        var record = entry.completion;\n\n        if (entry.tryLoc === \"root\") {\n          // Exception thrown outside of any try block that could handle\n          // it, so set the completion value of the entire function to\n          // throw the exception.\n          return handle(\"end\");\n        }\n\n        if (entry.tryLoc <= this.prev) {\n          var hasCatch = hasOwn.call(entry, \"catchLoc\");\n          var hasFinally = hasOwn.call(entry, \"finallyLoc\");\n\n          if (hasCatch && hasFinally) {\n            if (this.prev < entry.catchLoc) {\n              return handle(entry.catchLoc, true);\n            } else if (this.prev < entry.finallyLoc) {\n              return handle(entry.finallyLoc);\n            }\n\n          } else if (hasCatch) {\n            if (this.prev < entry.catchLoc) {\n              return handle(entry.catchLoc, true);\n            }\n\n          } else if (hasFinally) {\n            if (this.prev < entry.finallyLoc) {\n              return handle(entry.finallyLoc);\n            }\n\n          } else {\n            throw new Error(\"try statement without catch or finally\");\n          }\n        }\n      }\n    },\n\n    abrupt: function(type, arg) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.tryLoc <= this.prev &&\n            hasOwn.call(entry, \"finallyLoc\") &&\n            this.prev < entry.finallyLoc) {\n          var finallyEntry = entry;\n          break;\n        }\n      }\n\n      if (finallyEntry &&\n          (type === \"break\" ||\n           type === \"continue\") &&\n          finallyEntry.tryLoc <= arg &&\n          arg <= finallyEntry.finallyLoc) {\n        // Ignore the finally entry if control is not jumping to a\n        // location outside the try/catch block.\n        finallyEntry = null;\n      }\n\n      var record = finallyEntry ? finallyEntry.completion : {};\n      record.type = type;\n      record.arg = arg;\n\n      if (finallyEntry) {\n        this.method = \"next\";\n        this.next = finallyEntry.finallyLoc;\n        return ContinueSentinel;\n      }\n\n      return this.complete(record);\n    },\n\n    complete: function(record, afterLoc) {\n      if (record.type === \"throw\") {\n        throw record.arg;\n      }\n\n      if (record.type === \"break\" ||\n          record.type === \"continue\") {\n        this.next = record.arg;\n      } else if (record.type === \"return\") {\n        this.rval = this.arg = record.arg;\n        this.method = \"return\";\n        this.next = \"end\";\n      } else if (record.type === \"normal\" && afterLoc) {\n        this.next = afterLoc;\n      }\n\n      return ContinueSentinel;\n    },\n\n    finish: function(finallyLoc) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.finallyLoc === finallyLoc) {\n          this.complete(entry.completion, entry.afterLoc);\n          resetTryEntry(entry);\n          return ContinueSentinel;\n        }\n      }\n    },\n\n    \"catch\": function(tryLoc) {\n      for (var i = this.tryEntries.length - 1; i >= 0; --i) {\n        var entry = this.tryEntries[i];\n        if (entry.tryLoc === tryLoc) {\n          var record = entry.completion;\n          if (record.type === \"throw\") {\n            var thrown = record.arg;\n            resetTryEntry(entry);\n          }\n          return thrown;\n        }\n      }\n\n      // The context.catch method must only be called with a location\n      // argument that corresponds to a known catch block.\n      throw new Error(\"illegal catch attempt\");\n    },\n\n    delegateYield: function(iterable, resultName, nextLoc) {\n      this.delegate = {\n        iterator: values(iterable),\n        resultName: resultName,\n        nextLoc: nextLoc\n      };\n\n      if (this.method === \"next\") {\n        // Deliberately forget the last sent value so that we don't\n        // accidentally pass it on to the delegate.\n        this.arg = undefined;\n      }\n\n      return ContinueSentinel;\n    }\n  };\n})(\n  // In sloppy mode, unbound `this` refers to the global object, fallback to\n  // Function constructor if we're in global strict mode. That is sadly a form\n  // of indirect eval which violates Content Security Policy.\n  (function() { return this })() || Function(\"return this\")()\n);\n});\n\n// This method of obtaining a reference to the global object needs to be\n// kept identical to the way it is obtained in runtime.js\nvar g = (function() { return this })() || Function(\"return this\")();\n\n// Use `getOwnPropertyNames` because not all browsers support calling\n// `hasOwnProperty` on the global `self` object in a worker. See #183.\nvar hadRuntime = g.regeneratorRuntime &&\n  Object.getOwnPropertyNames(g).indexOf(\"regeneratorRuntime\") >= 0;\n\n// Save the old regeneratorRuntime in case it needs to be restored later.\nvar oldRuntime = hadRuntime && g.regeneratorRuntime;\n\n// Force reevalutation of runtime.js.\ng.regeneratorRuntime = undefined;\n\nvar runtimeModule = runtime;\n\nif (hadRuntime) {\n  // Restore the original runtime.\n  g.regeneratorRuntime = oldRuntime;\n} else {\n  // Remove the global property added by runtime.js.\n  try {\n    delete g.regeneratorRuntime;\n  } catch(e) {\n    g.regeneratorRuntime = undefined;\n  }\n}\n\nvar regenerator = runtimeModule;\n\nvar RectCenterOutIterator = /*#__PURE__*/regenerator.mark(function RectCenterOutIterator(rectWidth, rectHeight) {\n\tvar stepLeft, stepTop, startLeft, startTop, endLeft, endTop, left, top, previousStartLeft, previousStartTop, previousEndLeft, previousEndTop, currentStartLeft, currentStartTop, currentEndLeft, currentEndTop, _top, _left, _top2, _left2;\n\n\treturn regenerator.wrap(function RectCenterOutIterator$(_context) {\n\t\twhile (1) {\n\t\t\tswitch (_context.prev = _context.next) {\n\t\t\t\tcase 0:\n\t\t\t\t\tif (!(rectWidth > 0 && rectHeight > 0)) {\n\t\t\t\t\t\t_context.next = 76;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\tstepLeft = void 0, stepTop = void 0;\n\n\t\t\t\t\tif (rectWidth > rectHeight) {\n\t\t\t\t\t\tstepLeft = 1;\n\t\t\t\t\t\tstepTop = rectHeight / rectWidth;\n\t\t\t\t\t} else if (rectHeight > rectWidth) {\n\t\t\t\t\t\tstepTop = 1;\n\t\t\t\t\t\tstepLeft = rectWidth / rectHeight;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstepLeft = stepTop = 1;\n\t\t\t\t\t}\n\n\t\t\t\t\tstartLeft = Math.floor(rectWidth / 2);\n\t\t\t\t\tstartTop = Math.floor(rectHeight / 2);\n\t\t\t\t\tendLeft = rectWidth - startLeft;\n\t\t\t\t\tendTop = rectHeight - startTop;\n\n\t\t\t\t\tif (!(startLeft < endLeft)) {\n\t\t\t\t\t\t_context.next = 17;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\tleft = startLeft;\n\n\t\t\t\tcase 9:\n\t\t\t\t\tif (!(left <= endLeft)) {\n\t\t\t\t\t\t_context.next = 15;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 12;\n\t\t\t\t\treturn [left, startTop];\n\n\t\t\t\tcase 12:\n\t\t\t\t\t++left;\n\t\t\t\t\t_context.next = 9;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 15:\n\t\t\t\t\t_context.next = 25;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 17:\n\t\t\t\t\tif (!(startTop < endTop)) {\n\t\t\t\t\t\t_context.next = 25;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\ttop = startTop;\n\n\t\t\t\tcase 19:\n\t\t\t\t\tif (!(top <= endTop)) {\n\t\t\t\t\t\t_context.next = 25;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 22;\n\t\t\t\t\treturn [startLeft, top];\n\n\t\t\t\tcase 22:\n\t\t\t\t\t++top;\n\t\t\t\t\t_context.next = 19;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 25:\n\t\t\t\t\tpreviousStartLeft = startLeft;\n\t\t\t\t\tpreviousStartTop = startTop;\n\t\t\t\t\tpreviousEndLeft = endLeft;\n\t\t\t\t\tpreviousEndTop = endTop;\n\n\t\t\t\tcase 29:\n\t\t\t\t\tif (!(endLeft < rectWidth || endTop < rectHeight)) {\n\t\t\t\t\t\t_context.next = 76;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\tstartLeft -= stepLeft;\n\t\t\t\t\tstartTop -= stepTop;\n\t\t\t\t\tendLeft += stepLeft;\n\t\t\t\t\tendTop += stepTop;\n\n\t\t\t\t\tcurrentStartLeft = Math.floor(startLeft);\n\t\t\t\t\tcurrentStartTop = Math.floor(startTop);\n\t\t\t\t\tcurrentEndLeft = Math.ceil(endLeft);\n\t\t\t\t\tcurrentEndTop = Math.ceil(endTop);\n\n\t\t\t\t\tif (!(currentEndLeft > previousEndLeft)) {\n\t\t\t\t\t\t_context.next = 46;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_top = currentStartTop;\n\n\t\t\t\tcase 40:\n\t\t\t\t\tif (!(_top < currentEndTop)) {\n\t\t\t\t\t\t_context.next = 46;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 43;\n\t\t\t\t\treturn [currentEndLeft, _top];\n\n\t\t\t\tcase 43:\n\t\t\t\t\t++_top;\n\t\t\t\t\t_context.next = 40;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 46:\n\t\t\t\t\tif (!(currentEndTop > previousEndTop)) {\n\t\t\t\t\t\t_context.next = 54;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_left = currentEndLeft;\n\n\t\t\t\tcase 48:\n\t\t\t\t\tif (!(_left > currentStartLeft)) {\n\t\t\t\t\t\t_context.next = 54;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 51;\n\t\t\t\t\treturn [_left, currentEndTop];\n\n\t\t\t\tcase 51:\n\t\t\t\t\t--_left;\n\t\t\t\t\t_context.next = 48;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 54:\n\t\t\t\t\tif (!(currentStartLeft < previousStartLeft)) {\n\t\t\t\t\t\t_context.next = 62;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_top2 = currentEndTop;\n\n\t\t\t\tcase 56:\n\t\t\t\t\tif (!(_top2 > currentStartTop)) {\n\t\t\t\t\t\t_context.next = 62;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 59;\n\t\t\t\t\treturn [currentStartLeft, _top2];\n\n\t\t\t\tcase 59:\n\t\t\t\t\t--_top2;\n\t\t\t\t\t_context.next = 56;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 62:\n\t\t\t\t\tif (!(currentStartTop < previousStartTop)) {\n\t\t\t\t\t\t_context.next = 70;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_left2 = currentStartLeft;\n\n\t\t\t\tcase 64:\n\t\t\t\t\tif (!(_left2 < currentEndLeft)) {\n\t\t\t\t\t\t_context.next = 70;\n\t\t\t\t\t\tbreak;\n\t\t\t\t\t}\n\n\t\t\t\t\t_context.next = 67;\n\t\t\t\t\treturn [_left2, currentStartTop];\n\n\t\t\t\tcase 67:\n\t\t\t\t\t++_left2;\n\t\t\t\t\t_context.next = 64;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 70:\n\n\t\t\t\t\tpreviousStartLeft = currentStartLeft;\n\t\t\t\t\tpreviousStartTop = currentStartTop;\n\t\t\t\t\tpreviousEndLeft = currentEndLeft;\n\t\t\t\t\tpreviousEndTop = currentEndTop;\n\t\t\t\t\t_context.next = 29;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 76:\n\t\t\t\tcase 'end':\n\t\t\t\t\treturn _context.stop();\n\t\t\t}\n\t\t}\n\t}, RectCenterOutIterator, this);\n});\n\nvar AsyncQueue = function () {\n\tfunction AsyncQueue() {\n\t\t_classCallCheck(this, AsyncQueue);\n\n\t\tthis._values = [];\n\t\t/*\n  this._promise = undefined;\n  this._resolvePromise = undefined;\n  */\n\t}\n\n\t_createClass(AsyncQueue, [{\n\t\tkey: 'enqueue',\n\t\tvalue: function enqueue(value) {\n\t\t\tthis._values.push(value);\n\t\t\tif (this._promise) {\n\t\t\t\tthis._resolvePromise();\n\t\t\t}\n\t\t}\n\t}, {\n\t\tkey: 'dequeue',\n\t\tvalue: function () {\n\t\t\tvar _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {\n\t\t\t\tvar _this = this;\n\n\t\t\t\treturn regenerator.wrap(function _callee$(_context2) {\n\t\t\t\t\twhile (1) {\n\t\t\t\t\t\tswitch (_context2.prev = _context2.next) {\n\t\t\t\t\t\t\tcase 0:\n\t\t\t\t\t\t\t\tif (!this._values.length) {\n\t\t\t\t\t\t\t\t\t_context2.next = 2;\n\t\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn _context2.abrupt('return', this._values.shift());\n\n\t\t\t\t\t\t\tcase 2:\n\t\t\t\t\t\t\t\tif (!this._promise) {\n\t\t\t\t\t\t\t\t\tthis._promise = new _Promise(function (resolve) {\n\t\t\t\t\t\t\t\t\t\t_this._resolvePromise = resolve;\n\t\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t_context2.next = 5;\n\t\t\t\t\t\t\t\treturn this._promise;\n\n\t\t\t\t\t\t\tcase 5:\n\t\t\t\t\t\t\t\tthis._promise = undefined;\n\n\t\t\t\t\t\t\tcase 6:\n\t\t\t\t\t\t\t\t_context2.next = 0;\n\t\t\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t\t\tcase 8:\n\t\t\t\t\t\t\tcase 'end':\n\t\t\t\t\t\t\t\treturn _context2.stop();\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}, _callee, this);\n\t\t\t}));\n\n\t\t\tfunction dequeue() {\n\t\t\t\treturn _ref.apply(this, arguments);\n\t\t\t}\n\n\t\t\treturn dequeue;\n\t\t}()\n\t}]);\n\n\treturn AsyncQueue;\n}();\n\n_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {\n\tvar _this2 = this;\n\n\tvar messages, _ref4, gridWidth, gridHeight, gridData, _loop;\n\n\treturn regenerator.wrap(function _callee2$(_context4) {\n\t\twhile (1) {\n\t\t\tswitch (_context4.prev = _context4.next) {\n\t\t\t\tcase 0:\n\t\t\t\t\tmessages = new AsyncQueue();\n\n\t\t\t\t\tthis.addEventListener('message', function (_ref3) {\n\t\t\t\t\t\tvar data = _ref3.data;\n\n\t\t\t\t\t\tmessages.enqueue(data);\n\t\t\t\t\t});\n\n\t\t\t\t\t_context4.next = 4;\n\t\t\t\t\treturn messages.dequeue();\n\n\t\t\t\tcase 4:\n\t\t\t\t\t_ref4 = _context4.sent;\n\t\t\t\t\tgridWidth = _ref4.gridWidth;\n\t\t\t\t\tgridHeight = _ref4.gridHeight;\n\t\t\t\t\tgridData = new Uint8Array(gridWidth * gridHeight);\n\t\t\t\t\t_loop = /*#__PURE__*/regenerator.mark(function _loop() {\n\t\t\t\t\t\tvar _ref5, rectWidth, rectHeight, rectData, occupiedRectPixels, left, top;\n\n\t\t\t\t\t\treturn regenerator.wrap(function _loop$(_context3) {\n\t\t\t\t\t\t\twhile (1) {\n\t\t\t\t\t\t\t\tswitch (_context3.prev = _context3.next) {\n\t\t\t\t\t\t\t\t\tcase 0:\n\t\t\t\t\t\t\t\t\t\t_context3.next = 2;\n\t\t\t\t\t\t\t\t\t\treturn messages.dequeue();\n\n\t\t\t\t\t\t\t\t\tcase 2:\n\t\t\t\t\t\t\t\t\t\t_ref5 = _context3.sent;\n\t\t\t\t\t\t\t\t\t\trectWidth = _ref5.rectWidth;\n\t\t\t\t\t\t\t\t\t\trectHeight = _ref5.rectHeight;\n\t\t\t\t\t\t\t\t\t\trectData = _ref5.rectData;\n\t\t\t\t\t\t\t\t\t\toccupiedRectPixels = [];\n\n\t\t\t\t\t\t\t\t\t\tfor (left = 0; left < rectWidth; ++left) {\n\t\t\t\t\t\t\t\t\t\t\tfor (top = 0; top < rectHeight; ++top) {\n\t\t\t\t\t\t\t\t\t\t\t\tif (rectData[rectWidth * top + left]) {\n\t\t\t\t\t\t\t\t\t\t\t\t\toccupiedRectPixels.push([left, top]);\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t_this2.postMessage(function () {\n\t\t\t\t\t\t\t\t\t\t\tvar _loop2 = function _loop2(rectLeft, rectTop) {\n\t\t\t\t\t\t\t\t\t\t\t\tif (function () {\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar occupiedGridPixels = [];\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _iteratorNormalCompletion2 = true;\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _didIteratorError2 = false;\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _iteratorError2 = undefined;\n\n\t\t\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tfor (var _iterator2 = _getIterator(occupiedRectPixels), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref8 = _step2.value;\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref9 = _slicedToArray(_ref8, 2);\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _left3 = _ref9[0];\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _top3 = _ref9[1];\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t_left3 += rectLeft;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t_top3 += rectTop;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (gridData[gridWidth * _top3 + _left3]) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\toccupiedGridPixels.push([_left3, _top3]);\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t_didIteratorError2 = true;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t_iteratorError2 = err;\n\t\t\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (!_iteratorNormalCompletion2 && _iterator2.return) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t_iterator2.return();\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (_didIteratorError2) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tthrow _iteratorError2;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _iteratorNormalCompletion3 = true;\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _didIteratorError3 = false;\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _iteratorError3 = undefined;\n\n\t\t\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tfor (var _iterator3 = _getIterator(occupiedGridPixels), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref10 = _step3.value;\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref11 = _slicedToArray(_ref10, 2);\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _left4 = _ref11[0];\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tvar _top4 = _ref11[1];\n\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tgridData[gridWidth * _top4 + _left4] = 1;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t_didIteratorError3 = true;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t_iteratorError3 = err;\n\t\t\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (!_iteratorNormalCompletion3 && _iterator3.return) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t_iterator3.return();\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (_didIteratorError3) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tthrow _iteratorError3;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\t\t\treturn true;\n\t\t\t\t\t\t\t\t\t\t\t\t}()) {\n\t\t\t\t\t\t\t\t\t\t\t\t\treturn {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tv: { rectLeft: rectLeft, rectTop: rectTop }\n\t\t\t\t\t\t\t\t\t\t\t\t\t};\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t};\n\n\t\t\t\t\t\t\t\t\t\t\tvar _iteratorNormalCompletion = true;\n\t\t\t\t\t\t\t\t\t\t\tvar _didIteratorError = false;\n\t\t\t\t\t\t\t\t\t\t\tvar _iteratorError = undefined;\n\n\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\tfor (var _iterator = _getIterator(RectCenterOutIterator(gridWidth - rectWidth, gridHeight - rectHeight)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref6 = _step.value;\n\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ref7 = _slicedToArray(_ref6, 2);\n\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar rectLeft = _ref7[0];\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar rectTop = _ref7[1];\n\n\t\t\t\t\t\t\t\t\t\t\t\t\tvar _ret2 = _loop2(rectLeft, rectTop);\n\n\t\t\t\t\t\t\t\t\t\t\t\t\tif ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === \"object\") return _ret2.v;\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t} catch (err) {\n\t\t\t\t\t\t\t\t\t\t\t\t_didIteratorError = true;\n\t\t\t\t\t\t\t\t\t\t\t\t_iteratorError = err;\n\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\ttry {\n\t\t\t\t\t\t\t\t\t\t\t\t\tif (!_iteratorNormalCompletion && _iterator.return) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t_iterator.return();\n\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t} finally {\n\t\t\t\t\t\t\t\t\t\t\t\t\tif (_didIteratorError) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tthrow _iteratorError;\n\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\t\t\t\tthrow new Error();\n\t\t\t\t\t\t\t\t\t\t}());\n\n\t\t\t\t\t\t\t\t\tcase 9:\n\t\t\t\t\t\t\t\t\tcase 'end':\n\t\t\t\t\t\t\t\t\t\treturn _context3.stop();\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}, _loop, _this2);\n\t\t\t\t\t});\n\n\t\t\t\tcase 9:\n\t\t\t\t\treturn _context4.delegateYield(_loop(), 't0', 10);\n\n\t\t\t\tcase 10:\n\t\t\t\t\t_context4.next = 9;\n\t\t\t\t\tbreak;\n\n\t\t\t\tcase 12:\n\t\t\t\tcase 'end':\n\t\t\t\t\treturn _context4.stop();\n\t\t\t}\n\t\t}\n\t}, _callee2, this);\n})).call(self);\n\n}());\n"]));

var interpolateWeight = function interpolateWeight(weight, maxWeight) {
	var minWeight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	var outputMin = arguments[3];
	var outputMax = arguments[4];

	var input = weight;
	var inputMin = minWeight;
	var inputMax = maxWeight;
	if (outputMin === outputMax) {
		return outputMin;
	}

	if (inputMin === inputMax) {
		if (input <= inputMin) {
			return outputMin;
		}
		return outputMax;
	}

	var result = input;

	// Input Range
	result = (result - inputMin) / (inputMax - inputMin);

	// Output Range
	result = result * (outputMax - outputMin) + outputMin;
	return result;
};

var VueWordCloud = {
	render: function render(createElement) {
		return this.renderer(createElement);
	},


	props: {
		words: {
			type: Array,
			default: function _default() {
				return [];
			}
		},

		text: {
			type: [String, Function],
			default: ''
		},

		weight: {
			type: [Number, Function],
			default: 1
		},

		rotation: {
			type: [String, Function],
			default: function _default() {
				var values = [0, 3 / 4];
				return function () {
					return values[Math.floor(Math.random() * values.length)];
				};
			}
		},

		fontFamily: {
			type: [String, Function],
			default: 'serif'
		},

		fontStyle: {
			type: [String, Function],
			default: 'normal'
		},

		fontVariant: {
			type: [String, Function],
			default: 'normal'
		},

		fontWeight: {
			type: [String, Function],
			default: 'normal'
		},

		color: {
			type: [String, Function],
			default: 'Black'
		},

		fontSizeRatio: {
			type: Number
		},

		maxFontSize: {
			type: Number,
			default: Infinity
		},

		animationDuration: {
			type: Number,
			default: 5000
		},

		animationEasing: {
			type: String,
			default: 'ease'
		},

		containerSizeUpdateInterval: {
			type: Number,
			default: 1000
		}
	},

	data: function data() {
		return {
			containerWidth: 0,
			containerHeight: 0,

			//domWords: {},

			fulfilledBoundedWords: []
		};
	},
	mounted: function mounted() {
		this.startContainerSizeUpdate();
	},


	computed: {
		renderer: function renderer() {
			return this.domRenderer;
		},
		normalizedWords: function normalizedWords() {
			var _this = this;

			var words = this.words.map(function (word) {
				var text = void 0,
				    weight = void 0,
				    rotation = void 0,
				    fontFamily = void 0,
				    fontStyle = void 0,
				    fontVariant = void 0,
				    fontWeight = void 0,
				    color = void 0;
				if (word) {
					switch (typeof word === 'undefined' ? 'undefined' : _typeof(word)) {
						case 'string':
							{
								text = word;
								break;
							}
						case 'object':
							{
								if (Array.isArray(word)) {
									var _word = _slicedToArray(word, 2);

									text = _word[0];
									weight = _word[1];
								} else {
									text = word.text;
									weight = word.weight;
									rotation = word.rotation;
									fontFamily = word.fontFamily;
									fontStyle = word.fontStyle;
									fontVariant = word.fontVariant;
									fontWeight = word.fontWeight;
									color = word.color;
								}
								break;
							}
					}
				}
				if (text === undefined) {
					if (typeof _this.text === 'function') {
						text = _this.text(word);
					} else {
						text = _this.text;
					}
				}
				if (weight === undefined) {
					if (typeof _this.weight === 'function') {
						weight = _this.weight(word);
					} else {
						weight = _this.weight;
					}
				}
				if (rotation === undefined) {
					if (typeof _this.rotation === 'function') {
						rotation = _this.rotation(word);
					} else {
						rotation = _this.rotation;
					}
				}
				if (fontFamily === undefined) {
					if (typeof _this.fontFamily === 'function') {
						fontFamily = _this.fontFamily(word);
					} else {
						fontFamily = _this.fontFamily;
					}
				}
				if (fontStyle === undefined) {
					if (typeof _this.fontStyle === 'function') {
						fontStyle = _this.fontStyle(word);
					} else {
						fontStyle = _this.fontStyle;
					}
				}
				if (fontVariant === undefined) {
					if (typeof _this.fontVariant === 'function') {
						fontVariant = _this.fontVariant(word);
					} else {
						fontVariant = _this.fontVariant;
					}
				}
				if (fontWeight === undefined) {
					if (typeof _this.fontWeight === 'function') {
						fontWeight = _this.fontWeight(word);
					} else {
						fontWeight = _this.fontWeight;
					}
				}
				if (color === undefined) {
					if (typeof _this.color === 'function') {
						color = _this.color(word);
					} else {
						color = _this.color;
					}
				}
				return { text: text, weight: weight, rotation: rotation, fontFamily: fontFamily, fontStyle: fontStyle, fontVariant: fontVariant, fontWeight: fontWeight, color: color };
			});

			words = words.filter(function (_ref) {
				var text = _ref.text;
				return text;
			});
			words = words.filter(function (_ref2) {
				var weight = _ref2.weight;
				return weight > 0;
			});

			words = Array_uniqueBy(words, function (_ref3) {
				var text = _ref3.text;
				return text;
			});

			words.sort(function (word, otherWord) {
				return otherWord.weight - word.weight;
			});

			var minWeight = Iterable_min(words, function (_ref4) {
				var weight = _ref4.weight;
				return weight;
			});
			var maxWeight = Iterable_max(words, function (_ref5) {
				var weight = _ref5.weight;
				return weight;
			});
			if (this.fontSizeRatio) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = _getIterator(words), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var word = _step.value;

						word.weight = interpolateWeight(word.weight, maxWeight, minWeight, 1, this.fontSizeRatio);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			} else {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = _getIterator(words), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _word2 = _step2.value;

						_word2.weight /= minWeight;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			return words;
		},
		boundedWords: function boundedWords() {
			var _this2 = this;

			_asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
				return regenerator.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;
								_context.next = 3;
								return _this2.promisedBoundedWords;

							case 3:
								_this2.fulfilledBoundedWords = _context.sent;
								_context.next = 8;
								break;

							case 6:
								_context.prev = 6;
								_context.t0 = _context['catch'](0);

							case 8:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, _this2, [[0, 6]]);
			}))();
			return this.fulfilledBoundedWords;
		},
		promisedBoundedWords: function promisedBoundedWords() {
			return this.computeBoundedWords();
		},


		computeBoundedWords: function () {
			var getTextRect = function () {
				var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation) {
					var font, ctx, textWidth, textHeight, rectWidth, rectHeight, rectData, _ctx, imageData, i, ii;

					return regenerator.wrap(function _callee2$(_context2) {
						while (1) {
							switch (_context2.prev = _context2.next) {
								case 0:
									rotation = Math_convertTurnToRad(rotation);
									font = [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' ');
									_context2.prev = 2;
									_context2.next = 5;
									return document.fonts.load(font, text);

								case 5:
									_context2.next = 9;
									break;

								case 7:
									_context2.prev = 7;
									_context2.t0 = _context2['catch'](2);

								case 9:
									ctx = document.createElement('canvas').getContext('2d');

									ctx.font = font;
									textWidth = ctx.measureText(text).width;
									textHeight = fontSize;
									rectWidth = Math.ceil(textWidth * Math.abs(Math.cos(rotation)) + textHeight * Math.abs(Math.sin(rotation)));
									rectHeight = Math.ceil(textWidth * Math.abs(Math.sin(rotation)) + textHeight * Math.abs(Math.cos(rotation)));
									rectData = new Uint8Array(rectWidth * rectHeight);

									if (rectData.length > 0) {
										_ctx = document.createElement('canvas').getContext('2d');

										_ctx.canvas.width = rectWidth;
										_ctx.canvas.height = rectHeight;
										_ctx.translate(rectWidth / 2, rectHeight / 2);
										_ctx.rotate(rotation);
										_ctx.font = font;
										_ctx.textAlign = 'center';
										_ctx.textBaseline = 'middle';
										_ctx.fillText(text, 0, 0);
										imageData = _ctx.getImageData(0, 0, rectWidth, rectHeight).data;

										for (i = 0, ii = rectData.length; i < ii; ++i) {
											rectData[i] = imageData[i * 4 + 3];
										}
									}
									return _context2.abrupt('return', { textWidth: textWidth, textHeight: textHeight, rectWidth: rectWidth, rectHeight: rectHeight, rectData: rectData });

								case 18:
								case 'end':
									return _context2.stop();
							}
						}
					}, _callee2, this, [[2, 7]]);
				}));

				return function getTextRect(_x2, _x3, _x4, _x5, _x6, _x7, _x8) {
					return _ref7.apply(this, arguments);
				};
			}();

			var compute = function () {
				var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(context) {
					var containerWidth, containerHeight, words, containerAspect, boundedWords, boundWordWorker, gridResolution, gridWidth, gridHeight, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, word, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color, fontSize, _ref9, textWidth, textHeight, rectWidth, rectHeight, rectData, _ref10, rectLeft, rectTop;

					return regenerator.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									containerWidth = this.containerWidth;
									containerHeight = this.containerHeight;

									if (!(containerWidth <= 0 || containerHeight <= 0)) {
										_context3.next = 4;
										break;
									}

									return _context3.abrupt('return', []);

								case 4:
									words = this.normalizedWords;
									_context3.next = 7;
									return context.delayIfNotInterrupted();

								case 7:
									containerAspect = containerWidth / containerHeight;
									boundedWords = [];
									boundWordWorker = new Worker(boundWordWorkerContent);
									_context3.prev = 10;
									gridResolution = Math.pow(2, 22);
									gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
									gridHeight = Math.floor(gridResolution / gridWidth);

									boundWordWorker.postMessage({ gridWidth: gridWidth, gridHeight: gridHeight });
									_iteratorNormalCompletion3 = true;
									_didIteratorError3 = false;
									_iteratorError3 = undefined;
									_context3.prev = 18;
									_iterator3 = _getIterator(words);

								case 20:
									if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
										_context3.next = 48;
										break;
									}

									word = _step3.value;

									context.throwIfInterrupted();
									_context3.prev = 23;
									text = word.text, weight = word.weight, rotation = word.rotation, fontFamily = word.fontFamily, fontStyle = word.fontStyle, fontVariant = word.fontVariant, fontWeight = word.fontWeight, color = word.color;
									fontSize = weight * 4;
									_context3.next = 28;
									return getTextRect(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation);

								case 28:
									_ref9 = _context3.sent;
									textWidth = _ref9.textWidth;
									textHeight = _ref9.textHeight;
									rectWidth = _ref9.rectWidth;
									rectHeight = _ref9.rectHeight;
									rectData = _ref9.rectData;

									boundWordWorker.postMessage({ rectWidth: rectWidth, rectHeight: rectHeight, rectData: rectData });
									_context3.next = 37;
									return Worker_getMessage(boundWordWorker);

								case 37:
									_ref10 = _context3.sent;
									rectLeft = _ref10.rectLeft;
									rectTop = _ref10.rectTop;

									boundedWords.push({ text: text, rotation: rotation, fontFamily: fontFamily, fontSize: fontSize, fontStyle: fontStyle, fontVariant: fontVariant, fontWeight: fontWeight, rectLeft: rectLeft, rectTop: rectTop, rectWidth: rectWidth, rectHeight: rectHeight, textWidth: textWidth, textHeight: textHeight, color: color });
									_context3.next = 45;
									break;

								case 43:
									_context3.prev = 43;
									_context3.t0 = _context3['catch'](23);

								case 45:
									_iteratorNormalCompletion3 = true;
									_context3.next = 20;
									break;

								case 48:
									_context3.next = 54;
									break;

								case 50:
									_context3.prev = 50;
									_context3.t1 = _context3['catch'](18);
									_didIteratorError3 = true;
									_iteratorError3 = _context3.t1;

								case 54:
									_context3.prev = 54;
									_context3.prev = 55;

									if (!_iteratorNormalCompletion3 && _iterator3.return) {
										_iterator3.return();
									}

								case 57:
									_context3.prev = 57;

									if (!_didIteratorError3) {
										_context3.next = 60;
										break;
									}

									throw _iteratorError3;

								case 60:
									return _context3.finish(57);

								case 61:
									return _context3.finish(54);

								case 62:
									_context3.prev = 62;

									boundWordWorker.terminate();
									return _context3.finish(62);

								case 65:
									_context3.next = 67;
									return context.delayIfNotInterrupted();

								case 67:
									return _context3.abrupt('return', boundedWords);

								case 68:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, this, [[10,, 62, 65], [18, 50, 54, 62], [23, 43], [55,, 57, 61]]);
				}));

				return function compute(_x9) {
					return _ref8.apply(this, arguments);
				};
			}();

			return function () {
				var outerToken = void 0;
				return _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5() {
					var self, innerToken;
					return regenerator.wrap(function _callee5$(_context5) {
						while (1) {
							switch (_context5.prev = _context5.next) {
								case 0:
									self = this;
									innerToken = outerToken = {};
									_context5.t0 = compute;
									_context5.t1 = this;

									_context5.t2 = function throwIfInterrupted() {
										if (this.interrupted) {
											throw new _class();
										}
									};

									_context5.t3 = function () {
										var _ref12 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(ms) {
											return regenerator.wrap(function _callee4$(_context4) {
												while (1) {
													switch (_context4.prev = _context4.next) {
														case 0:
															this.throwIfInterrupted();
															_context4.next = 3;
															return Promise_delay(ms);

														case 3:
															this.throwIfInterrupted();

														case 4:
														case 'end':
															return _context4.stop();
													}
												}
											}, _callee4, this);
										}));

										function delayIfNotInterrupted(_x10) {
											return _ref12.apply(this, arguments);
										}

										return delayIfNotInterrupted;
									}();

									_context5.t4 = {
										get interrupted() {
											return innerToken !== outerToken || self._isDestroyed;
										},

										throwIfInterrupted: _context5.t2,
										delayIfNotInterrupted: _context5.t3
									};
									_context5.next = 9;
									return _context5.t0.call.call(_context5.t0, _context5.t1, _context5.t4);

								case 9:
									return _context5.abrupt('return', _context5.sent);

								case 10:
								case 'end':
									return _context5.stop();
							}
						}
					}, _callee5, this);
				}));
			};
		}(),

		scaledBoundedWords: function scaledBoundedWords() {
			var words = this.boundedWords;
			var containerWidth = this.containerWidth;
			var containerHeight = this.containerHeight;
			var maxFontSize = this.maxFontSize;

			var containedLeft = Iterable_min(words, function (_ref13) {
				var rectLeft = _ref13.rectLeft;
				return rectLeft;
			});
			var containedRight = Iterable_max(words, function (_ref14) {
				var rectLeft = _ref14.rectLeft,
				    rectWidth = _ref14.rectWidth;
				return rectLeft + rectWidth;
			});
			var containedWidth = containedRight - containedLeft;

			var containedTop = Iterable_min(words, function (_ref15) {
				var rectTop = _ref15.rectTop;
				return rectTop;
			});
			var containedBottom = Iterable_max(words, function (_ref16) {
				var rectTop = _ref16.rectTop,
				    rectHeight = _ref16.rectHeight;
				return rectTop + rectHeight;
			});
			var containedHeight = containedBottom - containedTop;

			var scaleFactor = Math.min(containerWidth / containedWidth, containerHeight / containedHeight);

			var currentMaxFontSize = Iterable_max(words, function (_ref17) {
				var fontSize = _ref17.fontSize;
				return fontSize;
			}) * scaleFactor;
			if (currentMaxFontSize > maxFontSize) {
				scaleFactor *= maxFontSize / currentMaxFontSize;
			}

			return words.map(function (_ref18) {
				var text = _ref18.text,
				    color = _ref18.color,
				    fontFamily = _ref18.fontFamily,
				    fontSize = _ref18.fontSize,
				    fontStyle = _ref18.fontStyle,
				    fontVariant = _ref18.fontVariant,
				    fontWeight = _ref18.fontWeight,
				    rotation = _ref18.rotation,
				    rectLeft = _ref18.rectLeft,
				    rectTop = _ref18.rectTop,
				    rectWidth = _ref18.rectWidth,
				    rectHeight = _ref18.rectHeight,
				    textWidth = _ref18.textWidth,
				    textHeight = _ref18.textHeight;

				rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor + containerWidth / 2;
				rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor + containerHeight / 2;
				rectWidth *= scaleFactor;
				rectHeight *= scaleFactor;
				textWidth *= scaleFactor;
				textHeight *= scaleFactor;
				fontSize *= scaleFactor;
				return { text: text, color: color, fontFamily: fontFamily, fontSize: fontSize, fontStyle: fontStyle, fontVariant: fontVariant, fontWeight: fontWeight, rotation: rotation, rectLeft: rectLeft, rectTop: rectTop, rectWidth: rectWidth, rectHeight: rectHeight, textWidth: textWidth, textHeight: textHeight };
			});
		},
		domWords: function domWords() {
			var words = [].concat(_toConsumableArray(this.scaledBoundedWords));
			var wordsCount = words.length;
			var transitionDuration = this.animationDuration / 4;
			var transitionDelay = (this.animationDuration - transitionDuration) / wordsCount;
			var transitionEasing = this.animationEasing;
			var domWords = {};
			words.forEach(function (_ref19, index) {
				var text = _ref19.text,
				    color = _ref19.color,
				    fontFamily = _ref19.fontFamily,
				    fontSize = _ref19.fontSize,
				    fontStyle = _ref19.fontStyle,
				    fontVariant = _ref19.fontVariant,
				    fontWeight = _ref19.fontWeight,
				    rotation = _ref19.rotation,
				    rectLeft = _ref19.rectLeft,
				    rectTop = _ref19.rectTop,
				    rectWidth = _ref19.rectWidth,
				    rectHeight = _ref19.rectHeight,
				    textWidth = _ref19.textWidth;

				domWords[text] = {
					style: {
						position: 'absolute',
						left: rectLeft + rectWidth / 2 - textWidth / 2 + 'px',
						top: rectTop + rectHeight / 2 + 'px',
						color: color,
						font: [fontStyle, fontVariant, fontWeight, fontSize + 'px/0', fontFamily].join(' '),
						transform: 'rotate(' + rotation + 'turn)',
						whiteSpace: 'nowrap',
						transition: ['all', Math.round(transitionDuration) + 'ms', transitionEasing, Math.round(transitionDelay * index) + 'ms'].join(' ')
					},
					text: text
				};
			});
			return domWords;
		},
		startContainerSizeUpdate: function startContainerSizeUpdate() {
			return function () {
				var _this3 = this;

				if (!this._isDestroyed) {
					setTimeout(function () {
						_this3.startContainerSizeUpdate();
					}, this.containerSizeUpdateInterval);
					this.updateContainerSize();
				}
			};
		}
	},

	methods: {
		domRenderer: function domRenderer(createElement) {
			return createElement('div', {
				style: {
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden'
				}
			}, _Object$entries(this.domWords).map(function (_ref20) {
				var _ref21 = _slicedToArray(_ref20, 2),
				    key = _ref21[0],
				    _ref21$ = _ref21[1],
				    style = _ref21$.style,
				    text = _ref21$.text;

				return createElement('div', { key: key, style: style }, text);
			}));
		},
		canvasRenderer: function canvasRenderer(createElement) {
			// todo?
			/*
   let canvas = document.createElement('canvas');
   let ctx = canvas.getContext('2d');
   this.boundedWords.forEach(({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}) => {
   	ctx.save();
   	ctx.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
   	ctx.fillStyle = color;
   	ctx.textAlign = 'center';
   	ctx.textBaseline = 'middle';
   	ctx.fillText(text, 0, 0);
   	ctx.translate(rectLeft + rectWidth / 2, rectTop + rectHeight / 2);
   	ctx.rotate(Math_convertTurnToRad(rotation));
   	ctx.restore();
   });
   return canvas;
   */
		},
		svgRenderer: function svgRenderer(createElement) {
			// todo?
		},
		updateContainerSize: function updateContainerSize() {
			var _$el$getBoundingClien = this.$el.getBoundingClientRect(),
			    width = _$el$getBoundingClien.width,
			    height = _$el$getBoundingClien.height;

			this.containerWidth = width;
			this.containerHeight = height;
		}
	}
};

Vue.component('VueWordCloud', VueWordCloud);

return VueWordCloud;

})));
