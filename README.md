# Promise
Simple Promise implementation

Use it if `Promise` is not implemented:

    if(!window.Promise) {
      Promise = function(.....)
    }
    
Supports:
- resolve
- reject
- then (also in chain)
- catch
- all
- race

Used as a part of [Edequate framework](https://github.com/Edeqa/Edequate/blob/master/src/main/webapp/js/Edequate.js).
Fiddle is [here](http://jsfiddle.net/tujger/sp8d1guv/).
