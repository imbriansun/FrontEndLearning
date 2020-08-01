
// T1

// function b(){
//     console.log(myVar);
// }
// function a(){
//     var myVar=2;
//     b();
// }
// var myVar=1;
// a();//结果是：1



// T2

// var a="aa";
// function test(){
//  alert(a);//undefined，函数执行后，在函数环境内，var a会预解析，当弹出a时，首先先找本层环境内有无声明，发现有。但是代码没有执行到赋值，所以结果是undefined。
//  var a="bb";//var a会预解析在函数开头，执行到这行才进行赋值
//  alert(a);//“bb”
// }
// test();
// alert(a);//"aa" 找全局环境下的声明，找到了var a="aa"

// ***在test的 Active Object 里有变量a，但是进入test函数时还未执行到第二句给a赋值，因此再给a赋值前打印a则为undefined***



// var a="aa";
// function test(){
//  alert(a);//undefined，函数执行后，在函数环境内，var a会预解析，当弹出a时，首先先找本层环境内有无声明，发现有。但是代码没有执行到赋值，所以结果是undefined。
// }
// test();




// T3
// var a="aa";
// function test(){
//  alert(a);//“aa”，函数执行后，在函数环境内，没有找到本层环境关于a的声明，所以开始向上一层环境查找。
//  a="bb";//执行到这行开始改变全局a的量
// }
// test();
// alert(a);//"bb" 全局环境的a在函数执行时已经被改变



// T4
// function test(){ 
//     b();     //函数b会被预解析（用函数声明的方式定义函数会得到函数提升），因此可以调用，执行了输出1；
//     var a=1;
//     function b(){
//      console.log(1);
//      console.log(a);     // undefined    在函数b的Active Object中有定义变量a(在本函数作用域AO进行变量提升，
//                          // 但变量提升不会对变量进行赋值)，但是此时还没执行到赋值语句
//      var a=2;
//     }
// }
// test();



/*
    js引擎加载js文件流程：
    * 第一步骤是读取js代码，将所有变量声明和函数声明提升到全局作用域的顶端，即所谓的变量提升和函数提升，
      划重点只是提升变量声明，并不将赋值初始化提升。
    * 运行代码，从上至下运行。 
*/

/* 变量提升 & 函数提升

* 变量提升只是让程序知道这个变量在本函数作用域AO的存在，并不会在这一步给变量赋值
* 函数提升优先级大于变量提升优先级，因此当定义一个变量和一个函数同名时，调用此名称，执行的是这个函数体
  假如说alert(函数名())，这个函数没有return，则打印undefined

*/





// T5 -- 经典闭包
function buildList(list) {
    var result = [];
    for (var i = 0; i < list.length; i++) {
        var a_item = 'item' + i;
        result[i] = (function() {console.log(a_item + ' ' + list[i])} );
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