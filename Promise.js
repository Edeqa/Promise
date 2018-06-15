function Promise(callback) {
    this._pending = [];
    this._callback = callback;
    this.PENDING = "pending";
    this.RESOLVED = "resolved";
    this.REJECTED = "rejected";
    this.PromiseState = this.PENDING;
    this._catch = function(error) {
        console.error(error);
    };
    setTimeout(function(){
        try {
            callback.call(this, this.resolve.bind(this), this.reject.bind(this));
        } catch(error) {
            this.reject(error);
        }
    }.bind(this), 0)
}
Promise.prototype.resolve = function(object) {
    if(this.PromiseState !== this.PENDING) return;
    while(this._pending.length > 0) {
        var callbacks = this._pending.shift();
        try {
            var resolve = callbacks.resolve;
            if(resolve instanceof Promise) {
                resolve._pending = resolve._pending.concat(this._pending);
                resolve._catch = this._catch;
                resolve.resolve(object);
                return resolve;
            }
            object = resolve.call(this,object);
            if(object instanceof Promise) {
                object._pending = object._pending.concat(this._pending);
                object._catch = this._catch;
                return object;
            }
        } catch(error) {
            (callbacks.reject || this._catch).call(this, error);
            return;
        }
    }
    this.PromiseState = this.RESOLVED;
    return object;
};
Promise.prototype.reject = function(error) {
    if(this.PromiseState !== this.PENDING) return;
    this.PromiseState = this.REJECTED;
    try {
        this._catch(error);
    } catch(e) {
        console.error(error, e);
    }
};
Promise.prototype.then = function(onFulfilled, onRejected) {
    onFulfilled = onFulfilled || function(result) {
        return result;
    };
    this._catch = onRejected || this._catch;
    this._pending.push({resolve:onFulfilled, reject: onRejected});
    return this;
};
Promise.prototype.catch = function(onRejected) {
    var onFulfilled = function(result) {
        return result;
    };
    this._catch = onRejected || this._catch;
    this._pending.push({resolve:onFulfilled, reject: onRejected});
    return this;
};
Promise.all = function(array) {
    return new Promise(function() {
        var self = this;
        var counter = 0;
        var finishResult = [];
        function success(item) {
            counter++;
            finishResult.push(item);
            if(counter >= array.length) {
                self.resolve(finishResult);
            }
        }
        array.map(function(item) {
            if(item instanceof Promise) {
                item.then(function(result) {
                    success(result);
                }, function(error) {
                    array.map(function(item) {item.PromiseState = Promise.REJECTED});
                    self._catch(error);
                })
            } else {
                success(item);
            }
        })
    });
};
Promise.race = function(array) {
    return new Promise(function() {
        var self = this;
        var counter = 0;
        var finishResult = [];
        array.map(function(item) {
            if(item instanceof Promise) {
                item.then(function(result) {
                    array.map(function(item) {item.PromiseState = Promise.REJECTED});
                    self.resolve(result);
                }, function(error) {
                    array.map(function(item) {item.PromiseState = Promise.REJECTED});
                    self._catch(error);
                })
            } else {
                array.map(function(item) {item.PromiseState = Promise.REJECTED});
                self.resolve(item);
            }
        })
    });
};
Promise.resolve = function(value) {
    return new Promise(function(resolve, reject) {
        try {
            resolve(value);
        } catch(error) {
            reject(error);
        }
    });
};
Promise.reject = function(error) {
    return new Promise(function(resolve, reject) {
        reject(error);
    });
}
