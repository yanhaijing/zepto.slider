/**
 * zepto.slider plugin
 * @author yanxuefeng
 */
(function($){
	"use strict";
	$.fn.slider = function(opt){
		var
			o = $.extend({
				startIndex: 0,
				time: 3000,
				animationTime: 500,
				direction: "up",
				autoAnimation: true,
				imgWrap: ".js-slider-img-wrap",
				img: "li",
				numWrap: ".js-slider-num-wrap",
				num: "li",
				preventTouch: false,
				circle: false
			}, opt);
		return $(this).each(function () {
			var
				$slider = $(this),			
				$imgWrap = $(o.imgWrap, $slider),
				$imgs = $(o.img, $imgWrap),
				$numWrap = $(o.numWrap, $slider),
				$nums = $(o.num, $numWrap),
				len = $imgs.length,
				width = 320,
				height = 180,
				curIndex = o.startIndex,
				timeout;
				
			function fixIndex(index) {
				return (index + len) % len;
			}
			function updateSize() {
				var direction = o.direction;
				width = $slider.width();
				$imgs.width(width);
				height = $imgs.height();
				$slider.height(height);
				if (direction === "up" || direction === "down") {
					$imgWrap.width(width).height(height * len);
				} else if (direction === "left" || direction === "right") {
					$imgWrap.width(width * len).height(height);					
				}
			}	
			function stopAutoAnimation() {
				window.clearTimeout(timeout);
			}
			function translate(index, time) {
				var 
					direction = o.direction,
					transition;
				index = fixIndex(index || 0);
				curIndex = index;
				time = time || o.animationTime;
				$nums.removeClass("js-slider-num-cur").eq(index).addClass("js-slider-num-cur");
				if (direction === "up" || direction === "down") {
					transition = -(height * index) + "px";
					$imgWrap.css({'-webkit-transform':'translateY('+ transition +')','-webkit-transition': time + 'ms linear'});
				} else if (direction === "left" || direction === "right") {
					transition = -(width * index) + "px";
					$imgWrap.css({'-webkit-transform':'translateX('+ transition +')','-webkit-transition': time + 'ms linear'});
				}
			}
			function initEvent() {
				var 
					direction = o.direction;
				$slider.swipeLeft(function (e) {
					if (!o.circle && (curIndex + 1) >= len) {
						return 0;
					}
					translate(curIndex + 1);
					stopAutoAnimation();
					return 1;
				});
				$slider.swipeRight(function (e) {
					if (!o.circle && (curIndex - 1) < 0) {
						return 0;
					}
					translate(curIndex - 1);
					stopAutoAnimation();
					return 1;
				});
				if (o.preventTouch) {
					$slider.on("touchstart", function (e) {
						e.preventDefault();
					});
					$slider.on("touchmove", function (e) {
						e.preventDefault();
					});
				}
				
				$(window).on("load", function (e) {
					updateSize();
				});
				$(window).on("resize", function (e) {
					updateSize();
				});
				
			}
			function initAutoAnimation() {
				function animation() {
					var
						direction = o.direction;
					if (direction === "up") {
						translate(curIndex + 1);
					} else if (direction === "down") {
						translate(curIndex - 1);
					} else if (direction === "left") {
						translate(curIndex + 1);
					} else {
						translate(curIndex - 1);
					}
					
					timeout = window.setTimeout(animation, o.time + o.animationTime);
				}
				
				if (o.autoAnimation) {
					animation();
				}
			}
			function init() {
				var
					direction = o.direction;
				if (direction === "up" || direction === "down") {
					$slider.addClass("js-slider js-slider-v");
				} else if (direction === "left" || direction === "right") {
					$slider.addClass("js-slider js-slider-h");
					$imgs.addClass("js-slider-img");
				}				
				$imgWrap.addClass("js-slider-img-wrap");		
				$numWrap.addClass("js-slider-num-wrap");
				$nums.addClass("js-slider-num");
				updateSize();
				translate(curIndex);
				initEvent();
				initAutoAnimation();
			}
			
			init();//初始化
		});				
	};
}(Zepto));	