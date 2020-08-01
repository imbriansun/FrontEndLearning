# [【WEB开发】JavaScript中的立即执行函数表达式(IIFE)](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/)

BY [Michael Lee](http://lipeng1667.github.io/about)

 发表于 2016-12-20

阅读数:2278

**文章目录**

1. [1. 函数声明和函数表达式](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/#函数声明和函数表达式)
2. [2. IIFE](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/#IIFE)
3. [3. 解决闭包中的循环问题](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/#解决闭包中的循环问题)
4. \4. IIFE的其他用处
   1. [4.1. 防止包冲突](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/#防止包冲突)

立即执行函数表达式(Immediately-Invoked Function Expression)， 还有其他的名字：自执行匿名函数(self-executing anonymous function)。 接触到这个IIFE，最早就是为了解决闭包时造成的问题。

还记得我们上一篇Blog, [JavaScript中的闭包(closure)](http://lipeng1667.github.io/2016/12/20/closure-in-js/)中的例子么?



```
function buildList(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var a_item = 'item' + i;
        result.push( function() {console.log(a_item + ' ' + list[i])} );
    }
    return result;
}

function testList() {
    var fnlist = buildList([1,2,3]);
    // Using j only to help prevent confusion -- could use i.
    for (var j = 0; j < fnlist.length; j++) {
        fnlist[j]();
    }
}

testList() //logs "item2 undefined" 3 times
```

这个示例最终会输出3遍`item2 undefined`。
我想，我们已经理解了这个问题是如何造成的对吧，如果你还不理解，强烈建议读一遍之前[blog](http://lipeng1667.github.io/2016/12/20/closure-in-js/)中的所有例子。

那么这篇blog我们就来研究下如何解决这个问题。

# 函数声明和函数表达式

我们首先需要理解这两个概念：

```
// 函数声明
function f() {}

// 表达式（非匿名）
var f1 = function f() {}
// 表达式（匿名）
var f2 = function() {}
```

对于函数表达式，即可以是匿名的，也可以是非匿名的，不过对于非匿名的函数，其实这个函数也不能直接使用，必须通过等号左边的变量名称(f1, f2) 来调用。
在Javascript中，一对圆括号`()`是一种运算符，跟在函数名之后，表示调用该函数，所以我们可以通过函数表达式后面跟上()表示调用该函数。
那么问题来了，我们是否可以在函数声明之后立即调用呢？ 就像这样：

```
function f() {console.log('test');} ();
```

答案是NO。
原因是：`JavaScript引擎规定，如果function关键字出现在行首，一律解释成语句`。因此，JavaScript引擎看到行首是function关键字之后，认为这一段都是函数的定义，不应该以圆括号结尾，所以就报错了。

那我们想要让函数声明之后立即被调用，只需要不让function出现在行首就行了，这就是IIFE是怎么出现的了。

# IIFE

我们其实能经常在各种库中看到IIFE的用法，我们来看看jQuery3.1.1中开头的代码：

```
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal )
	{...}
```

是不是同样看到，用一对`()`将函数声明包围起来之后，直接在后面跟上`()`表示立即执行这个函数，只不过上面的例子中是带有两个参数的，直接传递到了当前的函数体中，这是IIFE的另一个特性，防止作用域污染。

除了用`()`还有很多方法可以达到同样的目的：

```
!function(){ /* code */ }();
~function(){ /* code */ }();
-function(){ /* code */ }();
+function(){ /* code */ }();

void function(){ /* code */ }();

// new关键字也能达到这个效果
new function(){ /* code */ }
new function(){ /* code */ }()
// 只有传递参数时，才需要最后那个圆括号
```

有人做过测试，使用`()`和`void`时，效率是最高的，所以推荐大家尽量使用这两种方式。

# 解决闭包中的循环问题

那么我们究竟如何来解决开篇提到的问题呢？？如何才能得到下面我们想要的答案呢？

```
item0 1
item1 2
item2 3
```

答案就是用IIFE，我们在执行循环时，用立即执行的函数表达式，这样就能读取到正确的index值了。

```
function buildList(list) {
    for (var i = 0; i < list.length; i++) {
        var a_item = 'item' + i;
        (function(index) {console.log(a_item + ' ' + list[index])})(i);
    }
}

buildList([1,2,3]);
```

上面的方法我们把每次循环的`i`作为参数传递给`index`，这样就可以形成正确的函数表达式了。

或者我们还可以不用传参数，直接这样写也可以：

```
function buildList(list) {
    for (var i = 0; i < list.length; i++) {
        var a_item = 'item' + i;
        (function() {console.log(a_item + ' ' + list[i])})();
    }
}

buildList([1,2,3]);
```

这种写法虽然简单，但是可读性没有上一种方法高，具体使用哪一种，看个人习惯了。

# IIFE的其他用处

## 防止包冲突

如果我们在页面中同时引用了多个js文件，如果这两个文件中有相同的变量定义，那么就会被覆盖掉。试想下面的例子：

lib_a.js

```
var num = 1;
// code....
```

lib_b.js

```
var num = 2;
// code....
```

如果在页面中同时引用lib_a.js和lib_a.js两个库，必然导致num变量被覆盖，为了解决这个问题，可以通过IIFE来解决：

lib_a.js

```
(function() {
	var num = 1;
	// code....
})();
```

lib_b.js

```
(function() {
	var num = 2;
	// code....
})();
```

------

参考&感谢：

- [JavaScript中的立即执行函数表达式](http://weizhifeng.net/immediately-invoked-function-expression.html)
- [IIFE-js中(function(){…})()立即执行函数写法理解](http://www.cnblogs.com/wawahaha/p/4865574.html)
- [立即调用的函数表达式（IIFE）](http://javascript.ruanyifeng.com/grammar/function.html#toc24)