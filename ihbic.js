function _cut(index) {
  return [ this.slice(0, index), this.slice(index, this.length) ];
};

function _cast() {
  var ret;

  if (this === "null")
    return null;  /* null */
  else if (this == (ret = parseInt(this)) || this == (ret = parseFloat(this)))
    return ret;   /* number */
  else if (this === "true")
    return true;  /* boolean */
  else if (this === "false")
    return false; /* boolean */
  
  try {
    /* Array and Object */
    return JSON.parse(this);
  } catch (e) {
    /* string */
    return this.valueOf();
  }
};

Object.assign(Array.prototype, {
  "cut": _cut
});

Object.assign(String.prototype, {
  "cut": _cut,
  "autoConvert": _autoConvert
});

addEventListener("DOMContentLoaded", function() {
  function decodeAndConvert(x) {
    /* decode and convert to a specific type */
    return x !== true ? decodeURIComponent(x).autoConvert() : x;
  }

  var argv = [],
      ret;

  if (location.search !== "")
    argv = 
      (location.search + " ")                      /* argv is querystring */
      .slice(1, -1)                                /* erasing first '?' */
      .split("&")                                  /* making array of params */
      .map(x => x.cut(x.indexOf("=") + 1))         /* cutting after first '='*/
      .map(x => [x[0].slice(0, -1), x[1]])         /* erasing '=' */
      .map(x => x[0] === "" ? [x[1], true] : x);   /* boolean params support */

  /* add hash to argv array */
  if (location.hash !== "")
    argv.unshift((location.hash + " ").slice(1, -1));

  /* argv[0] */
  argv.unshift(location.pathname);

  if (location.origin !== "null")
    argv[0].unshift(location.origin);

  /* decode and convert all argvs */
  /* argv.forEach(x =>     that line doesn't work */
  argv = argv.map(x => 
    typeof x === "string"
      ? decodeAndCast(x)
      : [ decodeAndCast(x[0]), decodeAndCast(x[1]) ]);

  /* make argv also an associative array */
  Object.assign(argv, argv
    .filter(x => typeof x !== "string")
    .reduce((prev, cur) =>
      Object.assign(prev, {[cur[0]]: cur[1]}), {}));

  ret = main(argv.length, argv);

  if (ret !== undefined)
    console.log("[debug] main returned:\n", ret);
});

delete _cut;
delete _autoConvert;

/* cut in the 49th line is probably better than split + join */
