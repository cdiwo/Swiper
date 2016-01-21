/**
 * Swiper v1.0.1
 * @create Mar 17, 2015
 * @author David Wei
 * @see http://github.com/cdiwo/Swiper
 * Licensed under MIT
 * Released on: Mar 23, 2015
 */
(function () {
    'use strict';

    /*===========================
    Swiper
    ===========================*/
    function Swiper(container, params) {
        
        var defaults = {
            direction: 'horizental', // 方向
            autoplay: false,// autoplay
            speed: 300,// Css3 animation duration
            easing: 'ease',// Css3 animation timing function
            inertia: true,// 开启惯性滑动
            touchRatio: 0.2,// 拖拽占比率，默认元素的1/5
            index: 0,// 初始下标
            wrapperClass: '.swiper-wrapper',
            slideClass: '.swiper-slide',
            debug: false,
            /*
            Callbacks:
            onInit: function()
            onSwipeLeft: function()
            onSwipeRight: function()
            onEdgeLeft: function()
            onEdgeRight: function()
            onSlideMove: function (e)
            onSlideEnd: function(index)
            onSlideChanged: function(index)
            */
        }

        // Extend defaults with parameters
        var params = params || {};
        for (var param in params) {
            defaults[param] = params[param];
        }

        // Swiper
        var s = this;

        // Params
        s.params = defaults;

        // Define Container, Wrapper and Slide
        if(container === undefined) throw new Error('Invalid container!');
        s.container =  container === window ? $(window) : $(container);
        s.wrapper = s.container.find(s.params.wrapperClass);
        s.slide = s.container.find(s.params.slideClass);

        // Is horizental
        function isH() {
            return s.params.direction === 'horizental';
        }

        // Touch Vars
        s.touchObject = {};//拖拽对象
        s.animType, s.transitionType, s.transformType, s.transformsEnabled;//Css3 Transition 相关参数
        s.touchDelay = 150;
        s.shouldClick = false;

        // Dragging Vars
        s.dragging = false;//正在拖拽
        s.edgeFriction = 0.35;//边缘减速系数
        s.inertiaFriction = 0.01;//惯性滑动系数
        s.position = 0;
        s.lastPosition = 0;//定位
        s.index = 0;//最后一次的下标

        // Slide Vars
        s.slideWidth, s.slideCount;//元素宽度px和个数

        // Autoplay paused
        s.autoplayPaused = false;

        /*=========================
        Slide progress
        ===========================*/
        s.getIndex = function() {
            // var verticalHeight;
            // verticalHeight = s.slide.outerHeight();
            if (s.position > 0) {
                return 0;
            }
            var index = Math.floor(Math.abs(s.position) / s.slideWidth);
            // 快速滑动
            if((s.touchObject.endTime - s.touchObject.startTime < s.touchDelay)) {
                if(s.swipeDirection() === "left")
                    index += 1;
            } 
            // 移动超过1/2，下标向后移动
            else if(Math.abs(s.position) % s.slideWidth / s.slideWidth > 1 / 2) {
                index += 1;
            }
            return (index >= s.slideCount) ? (s.slideCount - 1) : index;
        };
        s.swipeDirection = function(){
            if(isH())
                return s.touchObject.startX - s.touchObject.curX > 0 ? 'left' : 'right';
            else
                return s.touchObject.startY - s.touchObject.curY > 0 ? 'down' : 'up';
        };
        

        /*=========================
        Transitions
        ===========================*/
        s.slideTo = function(index) {
            var indexChanged = s.index != index,
            targetLeft = index * s.slideWidth;
            targetLeft = -targetLeft;

            // 记住最后的定位和下标
            s.lastPosition = targetLeft;
            s.index = index;

            // apply transform
            s.applyTransform(targetLeft);

            // disable transition
            setTimeout(function(){
                s.wrapper.css(s.transitionType, '');
                s.trigger('onSlideEnd', index);
            }, s.params.speed);

            // trigger slide changed
            if(indexChanged) {
                s.trigger('onSlideChanged', index);
            }

            s.touchObject = {};
        };
        s.next = function() {
            var index = s.index >= s.slideCount - 1 ? 0 : s.index + 1;
            s.slideTo(index);
        };
        s.prev = function() {
            var index = s.index <= 0 ? s.slideCount - 1 : s.index - 1;
            s.slideTo(index);
        };

        /*=========================
        Translate/transition helpers
        ===========================*/
        s.applyTransform = function(x, y, speed) {
            var x = x || 0, y = y || 0, speed = speed || s.params.speed;
            // apply transation
            s.wrapper.css(s.transitionType, s.transformType + ' ' + speed + 'ms ' + s.params.easing);
            // apply animation
            s.wrapper.css(s.animType, 'translate(' + x + 'px, ' + y + 'px)');
        };
        s.setProps = function() {
            var bodyStyle = document.body.style;
            if (bodyStyle.webkitTransform !== undefined) {
                s.animType = 'webkitTransform';
                s.transformType = '-webkit-transform';
                s.transitionType = 'webkitTransition';
                if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
                    s.animType = false;
            }
            if (bodyStyle.transform !== undefined && s.animType !== false) {
                s.animType = 'transform';
                s.transformType = 'transform';
                s.transitionType = 'transition';
            }
            s.transformsEnabled = (s.animType !== null && s.animType !== false);
        };

        /*=========================
        Custom Events/Callbacks Trigger
        ===========================*/
        s.eventListeners = {};
        s.trigger = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3]);
            }
            
            // Trigger events
            var i, len;
            if (s.eventListeners[eventName]) {
                for (i = 0, len = s.eventListeners[eventName].length; i < len; i++) {
                    s.eventListeners[eventName][i](arguments[1], arguments[2], arguments[3]);
                }
            }
        };
        s.on = function (eventName, handler) {
            function normalizeEventName (eventName) {
                if (eventName.indexOf('on') !== 0) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                return eventName;
            }
            eventName = normalizeEventName(eventName);
            if (!s.eventListeners[eventName]) 
                s.eventListeners[eventName] = [];
            s.eventListeners[eventName].push(handler);
            return s;
        };

        /*=========================
        Events Handle
        ===========================*/
        s.swipeStart = function(event) {
            if (s.touchObject.fingerCount !== 1) {
                s.touchObject = {};
                return false;
            }

            var touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

            s.touchObject.startX = s.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            s.touchObject.startY = s.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            s.touchObject.startTime = (new Date()).getTime();

            s.dragging = true;
            s.autoplayPaused = true;
        };
        s.swipeMove = function(event) {
            var direction, swipeLength;
            var touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

            // 触发了touchstart、mousedown，且有拖拽点
            if (!s.dragging || touches && touches.length !== 1) {
                return false;
            }

            // 设置当前坐标值
            s.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            s.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            // 计算滑动距离
            swipeLength = s.touchObject.swipeLength = Math.round(
                Math.sqrt(
                    Math.pow(s.touchObject.curX - s.touchObject.startX, 2)
                )
            );

            // 计算滑动方向
            direction = s.swipeDirection();

            if (event.originalEvent !== undefined && swipeLength > 4) {
                event.preventDefault();
            }

            // 边缘检测
            s.touchObject.edgeHit = false;

            if ((s.index <= 0 && direction === "right") || (s.index + 1 >= s.slideCount && direction === "left")) {
                swipeLength = swipeLength * s.edgeFriction;
                s.touchObject.edgeHit = true;
            }

            s.position = s.lastPosition + swipeLength * (direction === "right" ? 1 : -1);

            // 输出调试信息
            if(s.params.debug) {
                console.log('direction:' + direction
                    + ',transform:'+ s.wrapper.css('transform')
                    + ',s.touchObject.curX:' + parseInt(s.touchObject.curX)
                    + ',s.touchObject.startX:' + parseInt(s.touchObject.startX)
                    + ',swipeLength:' + parseInt(swipeLength)
                    + ',position:' + s.position);
            }

            var xy = isH() ?  Math.ceil(s.position) + 'px, 0px' : '0px, ' +  Math.ceil(s.position) + 'px';
            s.wrapper.css(s.animType, 'translate(' + xy + ')');
        };
        s.swipeEnd = function(event) {
            var direction = s.swipeDirection();
            s.shouldClick = (s.touchObject.swipeLength > 10) ? false : true;
            s.autoplayPaused = false;

            if (!s.dragging || s.touchObject.curX === undefined) {
                return false;
            }
            s.dragging = false;//终止拖拽行为

            if (s.touchObject.edgeHit === true) {
                s.trigger("onEdge" + direction[0].toUpperCase() + direction.substring(1), event);
            }

            if (s.touchObject.swipeLength >= s.touchObject.minSwipe) {
                s.trigger("onSwipe"+ direction[0].toUpperCase() + direction.substring(1), event);
            } else {
                if (s.touchObject.startX !== s.touchObject.curX) {
                    s.touchObject = {};
                }
            }

            s.touchObject.endTime  = (new Date()).getTime();

            // 开启惯性滑动
            if(s.params.inertia && s.touchObject.swipeLength >= s.touchObject.minSwipe && (s.touchObject.endTime - s.touchObject.startTime < s.touchDelay)) {
                
                // v0 = s / t;
                var v = (s.touchObject.curX - s.touchObject.startX) / (s.touchObject.endTime - s.touchObject.startTime);
                var that = this;

                (function() {
                    var dir = v > 0 ? 1 : -1;//方向
                    var t = 10;//刷新速度
                    var nowV = v;//当前速度
                    var interval = setInterval(inertiaMove, t);//定时器

                    function inertiaMove() {
                        if(that.dragging) {
                            clearInterval(interval);
                            return;
                        }

                        nowV -= v * that.inertiaFriction;
                        var moveX = Math.ceil(nowV * t);

                        // 速度方向变化表示速度达到0了,拉到最左侧和最右侧
                        if (dir * nowV < 0
                            || that.lastPosition <= that.slideWidth * that.slideCount * -1
                            || that.lastPosition >= 0) {

                            clearInterval(interval);

                            //根据坐标停靠至最近的板块
                            that.slideTo(that.getIndex());
                            return;
                        }
                        // 实时存储为最终位置
                        that.lastPosition = that.position = that.position + moveX;
                        that.applyTransform(that.position, 0, t);
                    }
                })();
            } else {
                //根据坐标停靠至最近的板块
                s.slideTo(s.getIndex());
            }
        };
        s.clickHandle = function(event) {
            if (s.shouldClick === false) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();
            }
        };
        s.swipeHandle = function(event) {
            s.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
                event.originalEvent.touches.length : 1;

            s.touchObject.minSwipe = s.slideWidth * s.params.touchRatio;

            switch (event.type) {
                case 'touchstart':
                case 'mousedown': s.swipeStart(event); break;
                case 'touchmove':
                case 'mousemove': s.swipeMove(event); break;
                case 'touchend':
                case 'mouseup':
                case 'touchcancel':
                case 'mouseleave': s.swipeEnd(event); break;
                case 'click': s.clickHandle(event); break;
                case 'resize': break;
            }
        };

        /*=========================
        Initialize
        ===========================*/
        s.init = function() {
            // 设置元素宽度px和个数
            s.slideWidth = s.slide.outerWidth(true);
            s.slideCount = s.slide.size();

            // 添加事件监听器
            if(!s.unresize){
                $(window).on('resize', this, false);
            }
            s.container.on('touchstart mousedown touchmove mousemove touchend mouseup touchcancel mouseleave click', function(event){
                s.swipeHandle(event);
            });

            //设置CSS Transform属性
            s.setProps();

            if(s.params.autoplay) {
                s.autoplayInteral = setInterval(function() {
                    if(!s.autoplayPaused) {
                        s.next();
                    }
                }, s.params.autoplay);
            }
        };

        // 初始化
        s.init();

        // 返回实例
        return s;
    }

    /*=========================
    Exports - AMD, RequireJS and Global
    ===========================*/
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return Swiper;
        });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Swiper;
    } else {
        (typeof window !== 'undefined' ? window : this).Swiper = Swiper;
    }
})();
