# Audio音乐歌词滚动显示 Javascript插件

by : author:xcr1234 / QQ 530551426

__由于中国地区访问github的网速问题不稳定，该项目在github上我将停止更新，请移步到coding.net。__  
__同时我的其他项目会在github上继续更新__  
请访问：https://git.coding.net/xcr_abcd/music.git  

版本号：v17.0602  (bug修复)

**为HTML5 Audio标签的音乐播放、歌词滚动提供解决方案，兼容、扩充但不依赖于jQuery库.**

**支持所有主流浏览器、IE浏览器5及以上版本**

##1.在Web项目中引入js。

从github或coding上克隆源码

~~`git clone https://github.com/xcr1234/music.git`~~

或者

`git clone https://git.coding.net/xcr_abcd/music.git`


在网页中，添加对lrc.js文件的引用

`<script src="js/lrc.js" type="text/javascript" charset="utf-8"></script>`

__使用jQuery插件开发（可选)__

本插件也可以作为jQuery的插件开发，只需在引入lrc.js之前引入jQuery库即可。


```html
<script src="http://apps.bdimg.com/libs/jquery/1.11.1/jquery.js"></script>
<script src="js/lrc.js" type="text/javascript" charset="utf-8"></script>
```
##2.创建html标签

在页面中，创建以下标签：
```html
<audio src="xxx.mp3">
	你的浏览器不支持audio标签!
</audio>
<div id="container" style="overflow: hidden;">
	<div id="lrc"></div>
</div>
```

\#lrc是歌词的容器，歌词会以p标签形式显示在该div中。
\#container是lrc div的父容器，要求有overflow:hidden属性，因为在播放中，lrc的margin-top会发生变化从而达到歌词滚动的效果。

##3.动态加载lyric歌词文件。

支持标准格式的.lrc加载（ajax）并解析。

```javascript
var lrc1 = document.getElementById("lrc1");
var lrc = loadLrc(lrc1,"music/libai.lrc"); //该方法返回lyrics对象。

```

##4.关联lyrics对象与audio标签

```javascript
var audio1 = document.getElementById("audio1");
activeAudio(audio1,lrc);
```

##5.jQuery模式开发

```javascript
$(function() {

				$.lrcCtrl.active = function(p) {
					
					$(p).css({
						color:"red",
						fontWeight:700
					});

					
				}
				$.lrcCtrl.normal = function(p) {
					$(p).css({
						color:"black",
						fontWeight:"normal"
					});
				}

				$("#lrc1").lrc("music/libai.lrc", "#audio1");

			});
```

##6.更多实例



[lelvel5.mp3](http://xcr_abcd.coding.me/music/music.html) **精美的音乐盒效果实例（推荐）**  


[李白.mp3](http://xcr_abcd.coding.me/music/libai.html)  

[九九八十一.mp3](http://xcr_abcd.coding.me/music/81.html)  

video api实例

[九九八十一mv.mp4](http://xcr_abcd.coding.me/music/video.html)  

jquery api实例

[李白.mp3](http://xcr_abcd.coding.me/music/jq-libai.html)  


###7.浏览器支持

支持所有主流浏览器，Chrome/Firefox/Safari。具体版本暂时未测试。  

ie浏览器支持：  
  
[新]支持ie5及以上版本！

###8.支持ie浏览器

虽然ie8及以下浏览器不支持原生audio标签，但使用flash技术便可以支持audio标签的音频播放。  

audio.js是github上一个优秀的开源项目，它是款小巧的音乐播放器库，支持下拉式播放列表，最主要的是它可以在任何地方使用最新的HTML5中的audio标签来调用音乐文件并输出，而且兼容性也非常不错。    

官网：http://kolber.github.io/audiojs/

音乐文件并输出，而且兼容性也非常不错，完美通过下面的各大浏览器列表：  
1、Mobile Safari (iOS 3+)  
2、Android (2.2+, w/Flash)  
3、Safari (4+)  
4、Chrome (7+)  
5、Firefox (3+, w/ Flash)  
6、Opera (10+, w/ Flash)  
7、IE (6, 7, 8, w/ Flash)  

不过需要注意的是，目前主要只支持mp3格式，不支持ogg格式。

本插件已经集成了audio.js，它们在bsie目录中。首先，你需要在引入lrc.js之前，引入audio.js（或者引入audio.min.js）。  
ps:bsie=鄙视ie    

```html
	<script src="bsie/audio.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/lrc.js" type="text/javascript" charset="utf-8"></script>
```
  
然后，你可以像平常使用audio标签一样使用它们，例子见ie_libal.html。  

```html 
    <audio controls="controls" id="audio1" src="" autoplay="autoplay">
    </audio>
	<div class="container">
		<div class="lrc" id="lrc1">

		</div>

    </div>
```  

另外，如果你的项目没有ie浏览器兼容方面的要求，也可以删除bsie目录。  


