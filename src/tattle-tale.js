;(function(exports) {
  var TT = function() {
    this._events  = {};
    this._objects = {};
  };
  
  TT.prototype.register = function(ns, obj) {
    this._events[ns]  = {};
    this._objects[ns] = obj;
  };
  
  TT.prototype._observe = function(obj, method, ns) {
    var fn = obj[method]
      , _this = this;
    
    this._events[ns][method] = {
      before: [],
      after: []
    };
    
    return function() {
      var res;
      _this._events[ns][method].before
        .forEach(function(cb) {
          cb.apply(obj);
        });
        
      res = fn.apply(obj, arguments);
        
      _this._events[ns][method].after
        .forEach(function(cb) {
          cb.call(obj, res);
        });
    }
  };
  
  TT.prototype.after = function(key, cb) {
    var ns = this.getNS(key)
      , method = this.getMethod(key);
    
    if ( !this._events[ns][method] ) {
      this._objects[ns][method] = this._observe( this._objects[ns], method, ns );
    }
    
    this._events[ns][method].after.push(cb);
  };
  
  TT.prototype.getNS = function( key ) {
    var split = key.split(':');
    return split.slice(0, -1).join(':');
  };
  
  TT.prototype.getMethod = function( key ) {
    var split = key.split(":")
      , method = split[split.length - 1];
      
    return method;
  };
  
  TT.prototype.before = function(key, cb) {
    var ns = this.getNS(key)
      , method = this.getMethod(key);
      
    if ( !this._events[ns][method] ) {
      this._objects[ns][method] = this._observe( this._objects[ns], method, ns );
    }
    
    this._events[ns][method].before.push(cb);
  };
  
  
  exports.TattleTale = TT;

}).call(this, this);
