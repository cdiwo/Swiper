/**
 * Swiper v1.1.
 * @create Mar 17, 2015
 * @author David Wei
 * @see http://github.com/cdiwo/Swiper
 * Licensed under MIT
 * Released on: May 31, 2016
 */
(function () {
    'use strict';

    /*===========================
    Swiper
    ===========================*/
    function Swiper(container, params) {
        // Swiper
        var s = this;

        var defaults = {
            direction: 'horizental', // 方向
            autoplay: false,// autoplay
            speed: 300,// Css3 animation duration
            easing: 'ease',// Css3 animation timing function
            inertia: false,// 开启惯性滑动
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
        s.params = defaults;

        // 滑动层参数
        var wrapper, wrap = {}, slide;

        // Define Container, Wrapper
        if(container === undefined) throw new Error('Invalid container!');
        
        // Touch Vars
        s.touchObject = {};//拖拽对象
        s.animType, s.transitionType, s.transformType, s.transformsEnabled;//Css3 Transition 相关参数
        s.touchDelay = 150;
        s.shouldClick = false;

        // Dragging Vars
        s.dragging = false;//正在拖拽
        s.edgeFriction = 0.35;//边缘减速系数
        s.inertiaFriction = 0.01;//惯性滑动系数

        // Autoplay paused
        s.autoplayPaused = false;

        // Is horizental
        function isH() {
            return s.params.direction === 'horizental';
        }

        /*=========================
        Slide progress
        ===========================*/
        s.getIndex = function() {
            // var verticalHeight;
            // verticalHeight = s.slide.outerHeight();
            if (wrap.position > 0) {
                return 0;
            }
            var index = Math.floor(Math.abs(wrap.position) / wrap.slideWH);
            // 快速滑动
            if((s.touchObject.endTime - s.touchObject.startTime < s.touchDelay)) {
                if(s.swipeDirection() === "left" || s.swipeDirection() === "up")
                    index += 1;
            } 
            // 移动超过1/2，下标向后移动
            else if(Math.abs(wrap.position) % wrap.slideWH / wrap.slideWH > 1 / 2) {
                index += 1;
            }
            return (index >= wrap.slideCount) ? (wrap.slideCount - 1) : index;
        };
        s.swipeDirection = function() {
            if(isH())
                return s.touchObject.startX - s.touchObject.curX > 0 ? 'left' : 'right';
            else
                return s.touchObject.startY - s.touchObject.curY > 0 ? 'down' : 'up';
        };

        /*=========================
        Transitions
        ===========================*/
        s.slideTo = function(index) {
            var indexChanged = wrap.index != index,
            targetPosition = index * wrap.slideWH;
            targetPosition = -targetPosition;

            // 记住最后的定位和下标
            wrap.lastPosition = targetPosition;
            wrap.index = index;

            // apply transform
            s.applyTransform(targetPosition);

            // disable transition
            setTimeout(function(){
                wrapper.css(s.transitionType, '');
                s.trigger('onSlideEnd', index);
            }, s.params.speed);

            // trigger slide changed
            if(indexChanged) {
                s.trigger('onSlideChanged', index);
            }

            s.touchObject = {};
        };
        s.next = function() {
            var index = wrap.index >= wrap.slideCount - 1 ? 0 : wrap.index + 1;
            s.slideTo(index);
        };
        s.prev = function() {
            var index = wrap.index <= 0 ? wrap.slideCount - 1 : wrap.index - 1;
            s.slideTo(index);
        };

        /*=========================
        Translate/transition helpers
        ===========================*/
        s.applyTransform = function(len, speed, type) {
            var len = len || 0, speed = speed || s.params.speed;
            var xy = isH() ?  len + 'px, 0px' : '0px, ' +  len + 'px';
            // apply transation
            if(type !== false) 
                wrapper.css(s.transitionType, s.transformType + ' ' + speed + 'ms ' + s.params.easing);
            // apply animation
            wrapper.css(s.animType, 'translate(' + xy + ')');
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
        s.trigger = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3]);
            }
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
            if (!s.dragging || touches && touches.length !== 1) return false;

            // 设置当前坐标值
            s.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
            s.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

            // 移动到顶部后，手动触发touchend事件
            if(s.touchObject.curY  <= 0) return s.swipeEnd(event);

            // 计算滑动距离
            swipeLength = s.touchObject.swipeLength = Math.round(
                Math.sqrt(
                    Math.pow(
                        isH() ? (s.touchObject.curX - s.touchObject.startX) : (s.touchObject.curY - s.touchObject.startY)
                    , 2)
                )
            );

            // 计算滑动方向
            direction = s.swipeDirection();

            if (event.originalEvent !== undefined && swipeLength > 4) {
                event.preventDefault();
            }

            // 边缘检测
            s.touchObject.edgeHit = false;

            if ((wrap.index <= 0 && (direction === "right" || direction === "up")) 
                || (wrap.index + 1 >= wrap.slideCount && (direction === "left" || direction === "down"))) {
                swipeLength = swipeLength * s.edgeFriction;
                s.touchObject.edgeHit = true;
            }

            wrap.position = wrap.lastPosition + swipeLength * (direction === "right" || direction === "up" ? 1 : -1);

            // 输出调试信息
            if(s.params.debug) {
                console.log('direction:' + direction
                    + ',transform:'+ wrapper.css('transform')
                    + ',s.touchObject.curX:' + parseInt(s.touchObject.curX)
                    + ',s.touchObject.startX:' + parseInt(s.touchObject.startX)
                    + ',swipeLength:' + parseInt(swipeLength)
                    + ',position:' + wrap.position);
            }

            s.applyTransform(Math.ceil(wrap.position), 0, false);
            // var xy = isH() ?  Math.ceil(wrap.position) + 'px, 0px' : '0px, ' +  Math.ceil(wrap.position) + 'px';
            // wrapper.css(s.animType, 'translate(' + xy + ')');
        };
        s.swipeEnd = function(event) {
            var direction = s.swipeDirection();
            s.shouldClick = (s.touchObject.swipeLength > 10) ? false : true;
            s.autoplayPaused = false;

            if(s.shouldClick) return false;
            if (!s.dragging || s.touchObject.curX === undefined) return false;

            s.dragging = false;//终止拖拽行为

            if (s.touchObject.edgeHit === true) {
                s.trigger("onEdge" + direction[0].toUpperCase() + direction.substring(1), event);
            }

            if (s.touchObject.swipeLength >= s.touchObject.minSwipe) {
                s.trigger("onSwipe"+ direction[0].toUpperCase() + direction.substring(1), event);
            } else {
                if (s.touchObject.startX !== s.touchObject.curX || s.touchObject.startY !== s.touchObject.curY) {
                    s.touchObject = {};
                }
            }

            s.touchObject.endTime  = (new Date()).getTime();

            // 开启惯性滑动
            if(s.params.inertia && s.touchObject.swipeLength >= s.touchObject.minSwipe && (s.touchObject.endTime - s.touchObject.startTime < s.touchDelay)) {
                // v0 = s / t;
                var sl = isH() ? (s.touchObject.curX - s.touchObject.startX) : (s.touchObject.curY - s.touchObject.startY);
                var v = sl / (s.touchObject.endTime - s.touchObject.startTime);
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
                        var moveL = Math.ceil(nowV * t);

                        // 速度方向变化表示速度达到0了,拉到最左侧和最右侧
                        if (dir * nowV < 0
                            || wrap.lastPosition <= wrap.slideWH * wrap.slideCount * -1
                            || wrap.lastPosition > 0) {
                
                            clearInterval(interval);

                            //根据坐标停靠至最近的板块
                            that.slideTo(that.getIndex());
                            return;
                        }
                        // 实时存储为最终位置                        
                        wrap.lastPosition = wrap.position = wrap.position + moveL;
                        that.applyTransform(wrap.position, t);
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

            s.touchObject.minSwipe = wrap.slideWH * s.params.touchRatio;

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

            container =  container === window ? $(window) : $(container);
            wrapper = container.find(s.params.wrapperClass);
            slide = wrapper.find(s.params.slideClass);

            wrap = {
                position: 0,
                lastPosition: 0,//定位
                index: 0,//最后一次的下标
                slideCount: slide.size(),//个数
                slideWH: isH() ? slide.outerWidth(true) : slide.outerHeight(true),//元素宽高
            };

            // 添加事件监听器
            if(!s.unresize){
                $(window).on('resize', this, false);
            }
            container.on('touchstart mousedown touchmove mousemove touchend mouseup touchcancel mouseleave click', function(event) {
                s.swipeHandle(event);
                event.preventDefault();
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
