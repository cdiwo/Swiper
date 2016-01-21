# Swiper
基于HTML 5实现的可滑动幻灯片插件

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
**swiper-container**: Swiper的容器，里面包括滑动块（slides）的集合（wrapper)等
**swiper-wrapper**: Swiper触控的对象，可触摸区域，移动的块的集合，过渡时会随slide切换产生位移
**swiper-item**: Swiper切换的块中的一个，可以包含文字、图片、html元素或另外一个Swiper
```html
<div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swiper-item"></div>
        <div class="swiper-item"></div>
        <div class="swiper-item"></div>
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
|参数|类型|默认值|说明
|:-|:-|:-|:-|
|**构造参数**||||
|container|string||可视区域|
|**可选参数**||||
|params|string|{}|可选参数|
|**可选参数 - 详细**||||
|direction|string|horizental|滑动方向，包含水平'horizental'和竖直'vertical'|
|autoplay|number|0|自动切换间隔（单位ms)，默认为0不自动切换|
|speed|number|300|滑动速度，即从滑动开始到结束的时间（单位ms）|
|easing|string|ease|Css3 动画速度曲线|
|inertia|boolean|false|开启惯性滑动|
|touchRatio|float|0.2|滑动触发率，即滑动超过屏幕多少比例后触发切换，默认为20%|
|index|number|0|初始下标|
|wrapperClass|string|.swiper-wrapper|wrapper类名|
|slideClass|string|.swiper-slide|slide类名|
|debug|boolean|false|调试信息，控制台输出|
|**Callbacks**||||
|onInit|function()||初始化完成|
|onSwipeLeft|function()||向左滑动时|
|onSwipeRight|function()||向右滑动时|
|onEdgeLeft|function()||触发左边缘时|
|onEdgeRight|function()||触发右边缘时|
|onSlideMove|funcrion()||滑动进行中|
|onSlideEnd|function(index)||滑动完成后|
|onSlideChanged|function(index)||滑动项已改变时，index为滑动后的slide下标|

