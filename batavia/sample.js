
var MyType = function(name, bases) {
    Object.call(this);
    this.__name__ = name;
    this.__bases__ = bases;
};
MyType.prototype = Object.create(MyType.prototype);
MyType.prototype.__class__ = "MYTYPE'S CLASS";


MyType.prototype.type_method = function() { return "type_method result " + this.__name__; }
MyType.prototype.toString = function() { return "<MyType " + this.__name__ + ">"; }

var MyBase = function (x) {
    Object.call(this);
    console.log("BASES " + this.__class__);
    console.log("BASES " + this.__class__.__bases__);
    for (var attr in MyBase.prototype) {
        if (this[attr] === undefined) {
            if (this[attr] instanceof Function) {
                this[attr] = MyBase.prototype[attr].bind(this);
            } else {
                this[attr] = MyBase.prototype[attr];
            }
        }
    }

    this.x = x;
};

MyBase.prototype = Object.create(MyBase.prototype);
MyBase.prototype.__class__ = new MyType("MyBase", [Object]);
MyBase.prototype.__class__.$python = MyBase;

MyBase.prototype.base_method = function() { return "base_method result " + this.x; }
MyBase.prototype.toString = function() { return "<MyBase>"; }

var MyObject = function (x, y) {
    MyBase.call(this, x);
    this.y = y;
};

MyObject.prototype = Object.create(MyObject.prototype);
MyObject.prototype.__class__ = new MyType("MyObject", [MyBase]);
MyObject.prototype.__class__.$python = MyObject;

MyObject.prototype.object_method = function() { return "object_method result " + this.y; }
MyObject.prototype.toString = function() { return "<MyObject>"; }

obj = new MyObject(37, 42);

console.log("obj = " + obj);
console.log("obj.x = " + obj.x);
console.log("obj.y = " + obj.y);
console.log("obj.base_method = " + obj.base_method);
console.log("obj.base_method() = " + obj.base_method());
console.log("obj.object_method = " + obj.object_method);
console.log("obj.object_method() = " + obj.object_method());
console.log("obj.prototype = " + obj.prototype);
console.log("obj prototype = " + Object.getPrototypeOf(obj));
console.log("MyBase.prototype = " + MyBase.prototype);
console.log("MyObject.prototype = " + MyObject.prototype);
console.log("obj.__class__ = " + obj.__class__);
console.log("obj.__class__.$python = " + obj.__class__.$python);
