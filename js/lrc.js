/*
* Audio lyric
* Audio音乐歌词滚动显示 Javascript插件
* git:https://git.coding.net/xcr_abcd/music.git
* 版本号：v16.0722
*/
;(function(window, document,undefined) {

	var myJq = function(dom) {

		return new myJq.fn.init(dom);
	};
	myJq.fn = myJq.prototype = {
		init: function(dom) {
			this.dom = dom;
		},
		css: function(name) {
			var dom = this.dom;
			if (!(typeof window.getComputedStyle == "undefined")) {
				return window.getComputedStyle(dom, null)[name];
			} else {
				return dom.currentStyle[name];
			}
		},
		data: function(name, value) {
			var dom = this.dom;
			if (dom.dataset) {
				if (value == undefined) {
					return dom.dataset[name];
				} else {
					return dom.dataset[name] = value;
				}

			} else {
				var attr = "data-" + name;
				if (value == undefined) {
					return dom.getAttribute(attr);
				} else {
					return dom.setAttribute(attr, value);
				}
			}
		},
		extend: function(target, op1) {

			for (name in op1) {
				target[name] = op1[name];
			}

			return target;
		}

	};
	myJq.fn.init.prototype = myJq.fn;

	myJq.extend = myJq.fn.extend;

	myJq.get = function(url, data, success) {

		if (typeof success != "undefined" && typeof success != "function") {
			throw new TypeError(success + " is not a function");
		}
		var xmlHttp = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		//build url
		var getUrl = url;
		if (typeof data != "undefined") {
			var params = formatParams(data);
			getUrl = getUrl + "?" + params;
		}

		//open connection
		xmlHttp.open("GET", getUrl, true);

		//event

		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				var status = xmlHttp.status;
				if (status >= 200 && status < 300) {
					success(xmlHttp.responseText, status, xmlHttp);
				}

			}
		}

		xmlHttp.send();

	};

	var $ = window.jQuery ? window.jQuery : myJq;

	if (window.jQuery) {
		$.fn.extend({
			loadLrc: function(src) {
				return window.loadLrc(this[0], src);

			},
			activeAudio: function(lrcObj) {
				return window.activeAudio(this[0], lrcObj);
			},
			lrc: function(src, audio) {

				var obj = window.loadLrc(this[0], src);
				var audioObj = $(audio);

				window.activeAudio(audioObj[0], obj);

			}

		});

	}

	//全局controller样式。
	var controller = window.lrcCtrl = {};

	var options = {
		active: function(p) {
			p.style.fontWeight = "700";
		},
		normal: function(p) {
			p.style.fontWeight = "normal";
		},
		fix: 28,
		initMargin: null,
		offset: 0
	};

	controller.active = function(p) {

		p.style.fontWeight = "700";
	};

	controller.normal = function(p) {
		p.style.fontWeight = "normal";
	};

	$.lrcCtrl = window.lrcCtrl;

	//全局fix默认配置
	var fix = window.lrcFix = 28;

	//歌词计时器 constructor
	function timer(audio, lrc) {
		this.audio = audio;
		this.lrc = lrc.dom.getElementsByTagName("p");
		this.dom = lrc.dom;
		this.current = 0;
		this.currentTime = 0;

		this.options = $.extend(options, controller);
		if (lrc.offset != undefined) {
			this.options.offset = lrc.offset;
		}
		if (lrc.fix != undefined) {
			this.options.fix = lrc.fix;
		}
		
		if(this.options.initMargin==null){
			this.options.initMargin = parseInt($(this.dom).css("marginTop"));
			
		}

		this.lrcobj = lrc;

	};

	timer.prototype.active = function(p) {
		if (typeof this.lrcobj.active == "function") {
			this.lrcobj.active(p);
		} else if (typeof controller.active == "function") {
			controller.active(p);
		}
	};
	timer.prototype.normal = function(p) {
		if (typeof this.lrcobj.normal == "function") {
			this.lrcobj.normal(p);
		} else if (typeof controller.normal == "function") {
			controller.normal(p);
		}
	};

	timer.prototype.timeChanged = function(current) {

		if (this.current == this.lrc.length) {
			return;
		}
		//获取下一个歌词的时间
		var nextTime = parseFloat($(this.lrc[this.current]).data("time")) + this.options.offset;

		if (timeAccept(current, nextTime)) {
			this.moveNext();

			this.current++;
		}

	};
	timer.prototype.moveNext = function() {
		var marginTop = parseInt($(this.dom).css("marginTop"));
		if (this.current > 0) this.normal(this.lrc[this.current - 1]);
		this.active(this.lrc[this.current]);
		this.dom.style.marginTop = (marginTop - this.options.fix) + "px";

	};

	timer.prototype.toggle = function(time) {
		var f = -1;

		for (var i = this.lrc.length - 1; i >= 0; i--) {
			var ptime = parseFloat($(this.lrc[i]).data("time")) + this.options.offset;

			if (f < 0 && timeAccept(time, ptime)) {
				f = i;
			}
			this.normal(this.lrc[i]);

		}

		if (f < this.lrc.length && f > 0) {
			var marin = this.options.initMargin - this.options.fix * f;
			
			this.dom.style.marginTop = marin + "px";
			this.current = f;
		}

	};

	//utils

	function formatParams(data) {
		var arr = [];
		for (var name in data) {
			arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		}
		arr.push(("v=" + Math.random()).replace(".", ""));
		return arr.join("&");
	}

	//兼容ie浏览器不支持array.foreach方法
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(callback, thisArg) {
			var T, k = 0;
			if (this == null) {
				throw new TypeError(' this is null or not defined');
			}
			var O = Object(this);
			var len = O.length >>> 0;
			if (typeof callback !== "function") {
				throw new TypeError(callback + ' is not a function');
			}
			if (arguments.length > 1) {
				T = thisArg;
			}
			while (k < len) {
				var kValue;
				if (k in O) {
					kValue = O[k];
					callback.call(T, kValue, k, O);
				}
				k++;
			}

		};

	}

	function parseLyric(text) {
		//这个方法是在网上找的，因为我对正则表达式不熟

		//转载来源：http://www.cnblogs.com/Wayou/p/sync_lyric_with_html5_audio.html

		//将文本分隔成一行一行，存入数组
		var lines = text.split('\n'),
			//用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
			pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
			//保存最终结果的数组
			result = [];
		//去掉不含时间的行
		while (!pattern.test(lines[0])) {

			lines = lines.slice(1);
		};

		//上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
		lines[lines.length - 1].length === 0 && lines.pop();
		lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
			//提取出时间[xx:xx.xx]
			var time = v.match(pattern),
				//提取歌词
				value = v.replace(pattern, '');
			if (time != null) {
				//这里我加了一层判断，xcr

				//因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
				time.forEach(function(v1, i1, a1) {
					//去掉时间里的中括号得到xx:xx.xx
					var t = v1.slice(1, -1).split(':');
					//将结果压入最终数组
					result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
				});

			}

		});
		//最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
		result.sort(function(a, b) {
			return a[0] - b[0];
		});
		return result;
	}

	function timeAccept(currentTime, nextTime) {
		return currentTime > nextTime || Math.abs(currentTime - nextTime) <= 0.5
	}
	
	//audio provider
	//如果浏览器支持audio，则provider为html5Audio，否则为AudioJs。
	//在window.activeAudio中使用provider.
	
	
	
	function Html5Audio(dom,timeupdate,seeked){
		this.dom = dom;		
		if(typeof timeupdate=="function"){
			dom.addEventListener("timeupdate",function(){
				timeupdate(this.currentTime);
			})
		}
		if(typeof seeked == "function"){
			dom.addEventListener("seeked",function(){
				seeked(this.currentTime);
			});
		}
	}
	
	
	function AudioJs(dom,timeupdate,seeked){
		
		if(typeof window.audiojs != "object"&& typeof window.audiojs.events!="object"){
			throw new ReferenceError("audiojs is not correctly defined!");
		}
		
		audiojs.events.ready(function(){
			
			var player = audiojs.create(dom,{
				updatePlayhead:function(percent){
					if(typeof timeupdate=="function"){
						
						timeupdate(player.duration*percent);
					}
				},
				skipTo:function(percent){
					if(typeof seeked=="function"){
						seeked(player.duration*percent);
					}
				}
			});
			
		});
		
	}
	
	
	
	
	

	
	// window output
	var loadLrc = window.loadLrc = function(dom, url) {
		this.dom = dom;

		//解析lrc格式的lrc文件。
		$.get(url, undefined, function(d) {
			var arr = parseLyric(d);
			for (var i = 0; i < arr.length; i++) {
				var lry = arr[i];
				var p = document.createElement("p");

				$(p).data("time", lry[0]);
				p.innerHTML = lry[1];
				p.style.overflow="hidden";
				dom.appendChild(p);
			}
		});
		return this;

	};

	var aa = window.activeAudio = function(audio, lrc) {
		var t = new timer(audio, lrc);
		var provider = window.Audio?Html5Audio:AudioJs;
		
		
		provider(audio,function(currentTime){
			t.timeChanged(currentTime);
		},function(currentTime){
			t.toggle(currentTime);
		});
	
	};
})(window, window.document);