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
