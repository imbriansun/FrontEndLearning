## 在JavaScript中操作一个节点前取得节点：
* document.getElementById()
* document.getElementsByTagName()
* document.getElementsByClassName()

要精确地选择DOM，可以先定位父节点，再从父节点开始选择，以缩小范围。

例如：

```javascript
// 返回ID为'test'的节点：
var test = document.getElementById('test');

// 先定位ID为'test-table'的节点，再返回其内部所有tr节点：
var trs = document.getElementById('test-table').getElementsByTagName('tr');

// 先定位ID为'test-div'的节点，再返回其内部所有class包含red的节点：
var reds = document.getElementById('test-div').getElementsByClassName('red');

// 获取节点test下的所有直属子节点:
var cs = test.children;

// 获取节点test'下'第一个、最后一个子节点：
var first = test.firstElementChild;
var last = test.lastElementChild;


//返回一个DOM节点的String
String document.getElementById(String str);//id具有唯一性


//返回一个Array
Array document.getElementsByClassName(String str); //calss name不具有唯一性
Array document.getElementByTagName(String str);    //Tag name不具有唯一性

querySelector()
querySelectorAll()

//单个DOM属性
children
firstElementChild
lastElementChild

```


* 例题：
```html
<div id="test-div">
    
    <div class="c-red">
        <p id="test-p">JavaScript</p>
        <p>Java</p>
    </div>

    <div class="c-red c-green">
        <p>Python</p>
        <p>Ruby</p>
        <p>Swift</p>
    </div>
    
    <div class="c-green">
        <p>Scheme</p>
        <p>Haskell</p>
    </div>

</div>
```

```javascript
// 选择<p>JavaScript</p>:
var js = document.getElementById("test-p");

// 选择<p>Python</p>,<p>Ruby</p>,<p>Swift</p>:
var arr = document.getElementsByClassName("c-red c-green")[0].children;

// 选择<p>Haskell</p>:
var haskell = document.getElementsByClassName("c-green")[1].lastElementChild;
```
<br>
<br>

## 获取节点后更新节点

拿到一个DOM节点后，我们可以对它进行更新。

可以直接修改节点的文本，方法有两种：

一种是修改`innerHTML`属性，这个方式非常强大，不但可以修改一个DOM节点的文本内容，还可以直接通过HTML片段修改DOM节点内部的子树：

```javascript
// 获取<p id="p-id">...</p>
var p = document.getElementById('p-id');
// 设置文本为abc:
p.innerHTML = 'ABC'; // <p id="p-id">ABC</p>
// 设置HTML:
p.innerHTML = 'ABC <span style="color:red">RED</span> XYZ';
// <p>...</p>的内部结构已修改
```

用`innerHTML`时要注意，是否需要写入HTML。如果写入的字符串是通过网络拿到了，要注意对字符编码来避免XSS攻击。

第二种是修改`innerText`或`textContent`属性，这样可以自动对字符串进行HTML编码，保证无法设置任何HTML标签：

```javascript
// 获取<p id="p-id">...</p>
var p = document.getElementById('p-id');
// 设置文本:
p.innerText = '<script>alert("Hi")</script>';
// HTML被自动编码，无法设置一个<script>节点:
// <p id="p-id">&lt;script&gt;alert("Hi")&lt;/script&gt;</p>
```

两者的区别在于读取属性时，`innerText`不返回隐藏元素的文本，而`textContent`返回所有文本。另外注意IE<9不支持`textContent`。

修改CSS也是经常需要的操作。DOM节点的`style`属性对应所有的CSS，可以直接获取或设置。因为CSS允许`font-size`这样的名称，但它并非JavaScript有效的属性名，所以需要在JavaScript中改写为驼峰式命名`fontSize`：

```javascript
// 获取<p id="p-id">...</p>
var p = document.getElementById('p-id');
// 设置CSS:
p.style.color = '#ff0000';
p.style.fontSize = '20px';
p.style.paddingTop = '2em';
```





### 练习

有如下的HTML结构：


```html
<div id="test-div">
  <p id="test-js">javascript</p>
  <p>Java</p>
</div>
```



请尝试获取指定节点并修改：


```javascript
'use strict';
// 获取<p>javascript</p>节点:
var js = document.getElementById("test-js");

// 修改文本为JavaScript:
// TODO:
js.innerText = "JavaScript";

// 修改CSS为: color: #ff0000, font-weight: bold
// TODO:
js.style.color = "#ff0000";
js.style.fontWeight = "bold";



// 测试:
if (js && js.parentNode && js.parentNode.id === 'test-div' && js.id === 'test-js') {
    if (js.innerText === 'JavaScript') {
        if (js.style && js.style.fontWeight === 'bold' && (js.style.color === 'red' || js.style.color === '#ff0000' || js.style.color === '#f00' || js.style.color === 'rgb(255, 0, 0)')) {
            console.log('测试通过!');
        } else {
            console.log('CSS样式测试失败!');
        }
    } else {
        console.log('文本测试失败!');
    }
} else {
    console.log('节点测试失败!');
}
```





## 插入



## 删除DOM

删除一个DOM节点就比插入要容易得多。

要删除一个节点，首先要获得该节点本身以及它的父节点，然后，调用父节点的removeChild把自己删掉：

// 拿到待删除节点:
var self = document.getElementById('to-be-removed');
// 拿到父节点:
var parent = self.parentElement;
// 删除:
var removed = parent.removeChild(self);
removed === self; // true
注意到删除后的节点虽然不在文档树中了，但其实它还在内存中，可以随时再次被添加到别的位置。

当你遍历一个父节点的子节点并进行删除操作时，要注意，children属性是一个只读属性，并且它在子节点变化时会实时更新。

例如，对于如下HTML结构：

<div id="parent">
    <p>First</p>
    <p>Second</p>
</div>
当我们用如下代码删除子节点时：

var parent = document.getElementById('parent');
parent.removeChild(parent.children[0]);
parent.removeChild(parent.children[1]); // <-- 浏览器报错
浏览器报错：parent.children[1]不是一个有效的节点。原因就在于，当<p>First</p>节点被删除后，parent.children的节点数量已经从2变为了1，索引[1]已经不存在了。

因此，删除多个节点时，要注意children属性时刻都在变化。

练习
JavaScript
Swift
HTML
ANSI C
CSS
DirectX
<!-- HTML结构 -->
<ul id="test-list">
    <li>JavaScript</li>
    <li>Swift</li>
    <li>HTML</li>
    <li>ANSI C</li>
    <li>CSS</li>
    <li>DirectX</li>
</ul>