$(function(){
	var channel = (function(){
		var url = "http://www.douban.com/j/app/radio/channels";
		var template = $("#item-template").html();
		var activeCls = "active";

		var render = function(){
			$.getJSON(url, function(data){
				data.channels[0]["active"] = true;
				$("#channels").html(Mark.up(template, data));
				$("a[role='channel']").click(function(){
					$("a[role='channel']").removeClass(activeCls);
					$(this).addClass(activeCls);
				});
			});
		};

		return {
			render: render
		};
	})();

	var audioPlayer = (function(){
		var isplay = false;
		var is_new_song = false;
		var currentPlay = {};
		var cache = [];
		var url = "http://www.douban.com/j/app/radio/people?app_name=radio_desktop_win&version=100&channel=0";
		var likeBtn = $("button[role='like']");
		var playBtn = $("button[role='play']");
		var nextBtn = $("button[role='next']");
		var removeBtn = $("button[role='remove']");
		var audioCtrl = document.getElementById("dbplayer");
		var albumPicCtrl = $("#album_pic");
		var albumTitleCtrl = $("#album_title");
		var songTitleCtrl = $("#song_title");

		var init = function(){
			likeBtn.on('click', function(){

			});

			playBtn.on('click', function(){
				isplay? pause() : play();
				is_new_song = false;
			});

			nextBtn.on('click', function(){
				next();
			});

			removeBtn.on('click', function(){
				remove();
			});

		
			pull("n");
			$(document).on("pull-data-c", function(){
				currentPlay = cache.pop();
				is_new_song = true;
				play();
			});
		};

		var pull = function(type){
			$.getJSON(url + (type? "&type="+type : ""), function(data){
				$.each(data.song, function(i, item){
					cache.push(item);
				});
				$(document).trigger("pull-data-c");
			});
		};

		var play = function(){
			if(currentPlay){
				isplay = true;
				if(is_new_song){
					audioCtrl.src = currentPlay.url;
					albumPicCtrl.attr("src", currentPlay.picture);
					albumTitleCtrl.html(currentPlay.albumtitle);
					songTitleCtrl.html(currentPlay.title);
				}
				playBtn.removeClass("glyphicon-play").addClass("glyphicon-pause");
				audioCtrl.play();
			}
		};

		var pause = function(){
			isplay = false;
			playBtn.removeClass("glyphicon-pause").addClass("glyphicon-play");
			audioCtrl.pause();
		};

		var next = function(){
			currentPlay = cache.pop();
			is_new_song = true;
			if(cache.length < 1){
				pull("n");
			}
			play();
		};

		var like = function(){};

		var remove = function(){
			cache.pop();
			if(cache.length < 1){
				pull("n");
			}
		};

		return {
			init: init
		}
	})();

	channel.render();
	audioPlayer.init();
});