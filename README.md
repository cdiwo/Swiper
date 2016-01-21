# Swiper
可滑动幻灯片插件

## 使用方法

### 1. 引入js文件

CommonJS 方式引用
```js
var Swiper = require('swiper.js');
```

AMD 方式引用
```js
define(['./swiper'], function(Dropup) {
    // ...
});
```

全局方式，在HTML页面中引入:
```html
<script src="swiper.js"></script>
```

### 2. 引入css文件
```html
<link href="swiper.css" rel="stylesheet">
```
### 3. 添加html代码
* **swiper-container**: Swiper的容器，里面包括滑动块（slides）的集合（wrapper)等
* **swiper-wrapper**: Swiper触控的对象，可触摸区域，移动的块的集合，过渡时会随slide切换产生位移
* **swiper-slide**: Swiper切换的块中的一个，可以包含文字、图片、html元素或另外一个Swiper
```html
<div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swiper-slide"></div>
        <div class="swiper-slide"></div>
        <div class="swiper-slide"></div>
    </div>
</div>
```
### Javascript代码
```js
new Swiper(container, params);
```
Example：
```js
window.swiper = new Swiper('.swiper-container', {
    // 参数化事件处理
    onSlideChanged: function(index) {
        console.log('SlideChanged! Now change index to ' + index);
    }
});
// 外部绑定事件处理
// window.swiper.on('slideChanged', function(index) {
//    console.log('SlideChanged! Now change index to ' + index);
// });
```

## 参数说明
<table>
<thead>
<tr>
  <th>参数</th>
  <th>类型</th>
  <th>默认值</th>
  <th>说明</th>
</tr>
</thead>
<tbody>
<tr><th colspan="4">构造参数</th></tr>
<tr>
    <td>container</td>
    <td>string</td>
    <td></td>
    <td>可视区域</td>
</tr>
<tr>
    <td>params</td>
    <td>object</td>
    <td>{}</td>
    <td>可选参数</td>
</tr>
<tr>
  <th colspan="4">params参数</th>
</tr>
<tr>
    <td>direction</td>
    <td>string</td>
    <td>horizental</td>
    <td>滑动方向，包含水平'horizental'和竖直'vertical'</td>
</tr>
<tr>
    <td>autoplay</td>
    <td>number</td>
    <td>0</td>
    <td>自动切换间隔（单位ms)，默认为0不自动切换</td>
</tr>
<tr>
    <td>speed</td>
    <td>number</td>
    <td>300</td>
    <td>滑动速度，即从滑动开始到结束的时间（单位ms）</td>
</tr>
<tr>
    <td>easing</td>
    <td>string</td>
    <td>ease</td>
    <td>Css3 动画速度曲线</td>
</tr>
<tr>
    <td>inertia</td>
    <td>boolean</td>
    <td>false</td>
    <td>开启惯性滑动</td>
</tr>
<tr>
    <td>touchRatio</td>
    <td>float</td>
    <td>0.2</td>
    <td>滑动触发率，即滑动超过屏幕多少比例后触发切换，默认为20%</td>
</tr>
<tr>
    <td>index</td>
    <td>number</td>
    <td>0</td>
    <td>初始下标，即默认显示第(index+1)个slide</td>
</tr>
<tr>
    <td>wrapperClass</td>
    <td>string</td>
    <td>.swiper-wrapper</td>
    <td>wrapper类名</td>
</tr>
<tr>
    <td>slideClass</td>
    <td>string</td>
    <td>.swiper-slide</td>
    <td>slide类名</td>
</tr>
<tr>
    <td>debug</td>
    <td>boolean</td>
    <td>false</td>
    <td>调试信息，控制台输出</td>
</tr>
<tr><th colspan="4">回调函数</th></tr>
<tr>
    <td>onInit</td>
    <td>function()</td>
    <td></td>
    <td>初始化完成</td>
</tr>
<tr>
    <td>onSwipeLeft</td>
    <td>function()</td>
    <td></td>
    <td>向左滑动时</td>
</tr>
<tr>
    <td>onSwipeRight</td>
    <td>function()</td>
    <td></td>
    <td>向右滑动时</td>
</tr>
<tr>
    <td>onEdgeLeft</td>
    <td>function()</td>
    <td></td>
    <td>触发左边缘时</td>
</tr>
<tr>
    <td>onEdgeRight</td>
    <td>function()</td>
    <td></td>
    <td>触发右边缘时</td>
</tr>
<tr>
    <td>onSlideMove</td>
    <td>function()</td>
    <td></td>
    <td>滑动进行中</td>
</tr>
<tr>
    <td>onSlideEnd</td>
    <td>function(index)</td>
    <td></td>
    <td>滑动完成后</td>
</tr>
<tr>
    <td>onSlideChanged</td>
    <td>function(index)</td>
    <td></td>
    <td>滑动项已改变时，index为滑动后的slide下标</td>
</tr>
</tbody>
</table>

