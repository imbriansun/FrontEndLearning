# [【WEB开发】JavaScript中的闭包(closure)](http://lipeng1667.github.io/2016/12/20/closure-in-js/)

BY [Michael Lee](http://lipeng1667.github.io/about)

 发表于 2016-12-20

阅读数:976

**文章目录**

1. [1. 引言](http://lipeng1667.github.io/2016/12/20/closure-in-js/#引言)
2. \2. JS中的闭包
   1. [2.1. 简单的例子](http://lipeng1667.github.io/2016/12/20/closure-in-js/#简单的例子)
   2. 2.2. 更多的例子
      1. [2.2.1. Example 1](http://lipeng1667.github.io/2016/12/20/closure-in-js/#Example-1)
      2. [2.2.2. Example 2](http://lipeng1667.github.io/2016/12/20/closure-in-js/#Example-2)
      3. [2.2.3. Example 3](http://lipeng1667.github.io/2016/12/20/closure-in-js/#Example-3)
      4. [2.2.4. Example 4](http://lipeng1667.github.io/2016/12/20/closure-in-js/#Example-4)
      5. [2.2.5. Example 5](http://lipeng1667.github.io/2016/12/20/closure-in-js/#Example-5)
   3. [2.3. 其他注意的点](http://lipeng1667.github.io/2016/12/20/closure-in-js/#其他注意的点)
   4. [2.4. 闭包到底什么用](http://lipeng1667.github.io/2016/12/20/closure-in-js/#闭包到底什么用)

之前在写JS的时候，遇到过在循环中使用匿名函数时，程序运行的结果并不是按照我们想象的循环依次进行，当时随便在网上查了查，然后照着用IIFE方式解决了，但是一直没有去深入研究内部的原因。今天总算清闲下来，从JS中的闭包，一直到IIFE都细细理了一遍，这篇博文先总结下闭包的用法。文中部分内容引用了其他页面，会在最后统一引用说明。



# 引言

我们先来看一下我出现问题的代码，因为我的代码和项目结合较高，用下面的这段代码作为替代，我出现的问题和这里面是一样的：

```
function buildList(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var item = 'item' + i;
        result.push( function() {console.log(item + ' ' + list[i])} );
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

注释中已经列出来了，如果我们执行`testList()`方法，在浏览器的log中会输出3个同样的错误，`item2 undefined`。如果我们在一些比较智能的编译器(PhpStorm、WebStorm或者jetbrains的其他编译器)，会给我们这样的提示：`mutable variable is accessible from closure`。 如果我们google一下，就会发现可以通过IIFE来解决我们的问题，不过，为了能理解为什么会出现这样的问题，以及为何要用这样的方式去解决，就需要我们先从JS中的闭包(closure)来认识。

# JS中的闭包

关于`什么是闭包`这个问题，网上找了很多，但是其实解释来解释去，对初学者来说，依旧是晦涩难懂的，我这里其实也很难一下就解释清楚闭包到底是个什么鬼，不过我可以负责任的说，如果你从事前段开发有一段时间了，而且用到了JS，那么你八成已经用到过了闭包，只不过你不知道而已。

这个章节，我就从StackOverlfow上面赞同数最多的一个回答上做个简要的翻译好了，一定要耐着性子看完，有空的，最好能把所有的例子程序都跑一遍，确保你的真的理解了每一个例子。

## 简单的例子

我们先来看一个下面这个例子，将返回一个函数的引用：

```
function sayHello2(name) {
    var text = 'Hello ' + name; // Local variable
    var say = function() { console.log(text); }
    return say;
}
var say2 = sayHello2('Bob');
say2(); // logs "Hello Bob"
```

对于大多数的JavaScript程序员，应该都能够理解`say2`是一个函数引用，如果你不能理解这个，那最好先不要继续了，先去学习下JavaScript中的函数部分。
或者对于使用C语言的程序员来说，我们可以认为`sayHello2`函数返回了一个函数指针，`say`和`say2`都是函数指针。
其实上面的这个例子中就有一个闭包，因为在函数`sayHello2`中，又有一个匿名函数`function() { console.log(text); }`，在JavaScript中，如果你在一个函数体内又用到了`function`关键字，那么你将会生成一个闭包(Closure)。

在C语言或其他大部分语言中，当函数return了之后，函数内部申明的变量将被销毁，因为函数内部的变量是在栈上的，栈会随着函数的退出而销毁，如果不理解的，可以去研究下C++的传值和传引用。
但是在JavaScript中，我们却可以**在函数返回之后，依旧能使用其local变量**！上面的例子已经很好的说明了， `text`其实是函数`sayHello2`的local变量，但是我们却在它return了之后，依旧能访问到它。正是通过函数闭包，才达到了上面的目的。

JavaScript的魔法，也是它区别于C语言函数指针的一个特性是，我们可以认为，函数引用变量(上面例子中的`say2`)其实有2个指针，一个指针和C语言的函数指针一样，另一个指针，是一个隐藏的函数指针，指向了闭包。

## 更多的例子

如果你看懂了上面的例子，那你应该对闭包有了个浅显的认识，如果你这个时候就开始频繁使用闭包，那么你会遇到非常多无法理解的Bugs，所以，让我们接着看闭包都会带给我们什么。

### Example 1

```
function say667() {
    // Local variable that ends up within closure
    var num = 42;
    var say = function() { console.log(num); }
    num++;
    return say;
}
var sayNumber = say667();
sayNumber(); // logs 43
```

从上面的例子中，我们可以看到，使用了闭包，其实相当于把外部函数的local变量常驻于内存中了，换成面向对象的同学理解的话就是，本地变量不是值传递而是引用传递了。

### Example 2

```
var gLogNumber, gIncreaseNumber, gSetNumber;
function setupSomeGlobals() {
    // Local variable that ends up within closure
    var num = 42;
    // Store some references to functions as global variables
    gLogNumber = function() { console.log(num); }
    gIncreaseNumber = function() { num++; }
    gSetNumber = function(x) { num = x; }
}

setupSomeGlobals();
gIncreaseNumber();
gLogNumber(); // 43
gSetNumber(5);
gLogNumber(); // 5

var oldLog = gLogNumber;

setupSomeGlobals();
gLogNumber(); // 42

oldLog() // 5
```

这个例子就要稍微复杂一点了，同样需要注意的点也多了起来：

- 首先，3个全局函数变量拥有同一个闭包，因为它们都是在同一个函数(`setupSomeGlobals`)中被声明的，也就是说，这3个函数变量共享同一个闭包接入–`setupSomeGlobals`中的local变量`num`。
- 其次，当我们第2次调用`setupSomeGlobals()`时，我们创建了一个新的闭包，相当于在栈上又创建了一帧数据，也就是说，老的`gLogNumber`, `gIncreaseNumber`, `gSetNumber`将会被引用自新的闭包的函数变量覆盖掉。
- 在JavaScript中，只要外部的函数被调用一次，其内部的函数就会在栈上被重新创建一遍，这也是导致页面上内存泄漏的一个原因。

### Example 3

这个例子其实就是我们开篇时提到的例子。这个例子非常典型，对很多人来说，可能都会遇到这样的问题，如果你在函数的循环体内定义函数，一定要注意，函数的本地变量并不会像你刚开始想象的那样工作

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

那我们来看下为什么会打印3遍`item2 undefined`吧。

这一行代码：`result.push( function() {console.log(a_item + ' ' + list[i])}`实际上是添加匿名函数的引用到数组中，如果你不太熟悉匿名函数，那么你可以想象成这样的代码：

```
pointer = function() {console.log(item + ' ' + list[i])};
result.push(pointer);
```

当`fnlist = buildList([1,2,3])`这一行代码被执行的时候，其实已经产生了一个闭包，在这个闭包里面，item作为local变量在经过循环以后，值已经变成了`item2`(当`var i = 0; i < list.length; i++`执行到最后一个循环体内时`a_item='item' + i`将`a_item`赋值成为`item2`）。
而当我们通过`fnlist[j]()`3次分别调用函数时，其实这3次都去访问的同一个闭包，在闭包里面，`a_item`自然停留在最后一次循环之后的`item2`，而list[i]对于外部函数来说，循环结束之后，i就是个undefined的变量，所以结果就打印了3次`item2 undefined`。

那么我如何才能得到我们想要的效果，依次打印出下面的结果呢：

```
item0 1
item1 2
item2 3
```

我们会在下一篇博客，[JavaScript中的IIFE](http://lipeng1667.github.io/2016/12/20/IIFE-in-js/) 中进行解答，我们继续来看闭包还有那些需要注意的地方。

### Example 4

```
function sayAlice() {
    var say = function() { console.log(alice); }
    // Local variable that ends up within closure
    var alice = 'Hello Alice';
    return say;
}
sayAlice()();// logs "Hello Alice"
```

虽然local变量`alice`是在匿名函数申明之后才声明的，但是，我们依旧可以访问到它，这就说明，闭包含有当前作用域内的所有变量接入。
而`sayAlice()()`其实就是我们在第2部分要讲到的IIFE，它等价于

```
var refer = sayAlice();
refer();
```

### Example 5

```
function newClosure(someNum, someRef) {
    // Local variables that end up within closure
    var num = someNum;
    var anArray = [1,2,3];
    var ref = someRef;
    return function(x) {
        num += x;
        anArray.push(num);
        console.log('num: ' + num +
            '\nanArray ' + anArray.toString() +
            '\nref.someVar ' + ref.someVar);
      }
}
obj = {someVar: 4};
fn1 = newClosure(4, obj);
fn2 = newClosure(5, obj);
fn1(1); // num: 5; anArray: 1,2,3,5; ref.someVar: 4;
fn2(1); // num: 6; anArray: 1,2,3,6; ref.someVar: 4;
obj.someVar++;
fn1(2); // num: 7; anArray: 1,2,3,5,7; ref.someVar: 5;
fn2(2); // num: 8; anArray: 1,2,3,6,8; ref.someVar: 5;
```

这个例子向我们充分展示了**每一次对外部函数的调用都会产生一个独立的包含本地变量的闭包**。

## 其他注意的点

这部分总结我就不一一翻译了，如果你对前面所有的例子都能够彻底理解了，相信下面的点你也能够很自然地体会到是在说什么。

- Whenever you use function inside another function, a closure is used.
- Whenever you use `eval()` inside a function, a closure is used. The text you eval can reference local variables of the function, and within eval you can even create new local variables by using `eval('var foo = …')`
- When you use `new Function(…)` (the Function constructor) inside a function, it does not create a closure. (The new function cannot reference the local variables of the outer function.)
- A closure in JavaScript is like keeping a copy of all the local variables, just as they were when a function exited.
- It is probably best to think that a closure is always created just on entry to a function, and the local variables are added to that closure.
- A new set of local variables is kept every time a function with a closure is called (given that the function contains a function declaration inside it, and a reference to that inside function is either returned or an external reference is kept for it in some way).
- Two functions might look like they have the same source text, but have completely different behaviour because of their ‘hidden’ closure. I don’t think JavaScript code can actually find out if a function reference has a closure or not.
- If you are trying to do any dynamic source code modifications (for example: `myFunction = Function(myFunction.toString().replace(/Hello/,'Hola'));`), it won’t work if myFunction is a closure (of course, you would never even think of doing source code string substitution at runtime, but…).
- It is possible to get function declarations within function declarations within functions — and you can get closures at more than one level.
- I think normally a closure is the term for both the function along with the variables that are captured. Note that I do not use that definition in this article!
- I suspect that closures in JavaScript differ from those normally found in functional languages.

## 闭包到底什么用

好了，说了这么多，那么闭包到底什么用处？？
其实通过我们的例子，我们已经看到的闭包的两个最主要的用处：

- a closure is one way of supporting first-class functions; it is an expression that can reference variables within its scope (when it was first declared), assigned to a variable, passed as an argument to a function, or returned as a function result.
- a closure is a stack frame which is allocated when a function starts its execution, and not freedafter the function returns (as if a ‘stack frame’ were allocated on the heap rather than the stack!).

简单的翻译过来就是：

- 可以在函数外部读取函数内部的变量
- 可以将这些变量的值在内存中持久化

如果你还不能理解这两句话的意思，请返回去重新把所有的例子好好再体会一遍~

关于闭包就到这里了，对于Example 3中出现的问题，我们在下一篇Blog， JavaScript中的立即执行函数表达式(IIFE)中进行进一步解决。

------

参考&感谢：

- [How do JavaScript closures work?](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work?page=1&tab=active#tab-top)
- [学习Javascript闭包（Closure）](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)