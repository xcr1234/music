没有用到jQuery,纯js实现，只有2个方法。

支持播放/暂停/继续

var lrc = loadLrc(DOM对象,lrc歌词文件路径) 

//动态加载.lrc文件，并解析 返回lryic对象，要求支持ajax.

activeAudio(audio对象,lrc)

//关联audio对象和lyric对象。

请放到tomcat这样的服务器测试，不要用Hbuilder自带的服务器测试了

太垃圾！

fix属性是行距离,比如p标签的height是15px，margin-top:15px。
那么fix就是30。

active/normal支持全局/局部配置，实例见libal.html和music.html

!支持jQuery
见例子jq-libai.html