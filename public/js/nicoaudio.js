var NicoPlayer = function(){
  var current_audio = null;
  var prepare_timer = null;
  var next_audio = null;
  var do_next = true;
  var url = 'http://gong023.com/nicoplay/';
  var my_view = NicoView();
  return {
    'init' :function(index) {
      current_audio = new Audio("");
      if (! current_audio.canPlayType) {
        alert('browser does not support');
      }
      $.mobile.defaultPageTransition = 'slide';
      current_audio.autoplay = false;
      Playlist.init(index);
      var playing = Playlist.getPlaying(Playlist.getIndex());
      my_view.togglePlayer(playing.title);
      my_view.displayThumbnail(playing.video_id);
      this.play();
      if (prepare_timer == null) {
        setInterval("MyAudio.prepareNext()", 1500);
      }
    },
    'prepareNext' :function() {
      if (do_next === false) {
        return;
      }
      var next_index = nicoutil.addStrings(Playlist.getIndex(), 1);
      next_audio = new Audio(this.getSrc(next_index));
      next_audio.autoplay = false;
      do_next = false;
    },
    'getSrc' :function(index) {
      var index = index || Playlist.getIndex();
      var playing = Playlist.getPlaying(index);
      var date = nicoutil.parseDate(playing.ctime);
      return url + "public/audio/all/" + date + "/" + playing.video_id + ".mp3";
    },
    'play' :function() {
      if (current_audio === null) {
        alert('audio is not foud');
      }
      if (next_audio !== null && next_audio.src == this.getSrc()) {
        current_audio = next_audio;
      } else {
        current_audio.src = this.getSrc();
      }
      //current_audio.src = "http://taira-komori.jpn.org/sound/gamesf01/Surprise1.mp3";
      current_audio.play();
      current_audio.addEventListener('ended', this.playNext);
    },
    'pause' :function(go_back) {
      if (current_audio === null) {
        alert('audio is not found');
      }
      var go_back = go_back || false;
      if (go_back) {
        location.href = "#playlist";
      }
      current_audio.pause();
    },
    'playNext' :function() {
      var next = Playlist.next();
      my_view.togglePlayer(next.title);
      my_view.displayThumbnail(next.video_id);
      if (next_audio.src == MyAudio.getSrc()) {
        do_next = true;
      }
      MyAudio.play();
    }
  };
};
var NicoPlaylist = function(){
  var list;
  var index;
  return {
    'init' :function(current_playing) {
      list = JSON.parse(document.player.playlist.value);
      index = current_playing;
    },
    'getIndex' :function() {
      return index;
    },
    'getPlaying' :function(list_index){
      return list[list_index];
    },
    'next' :function() {
      var list_length = 0;
      for (var name in list) list_length++;
      if (index >= list_length - 1) {
        index = 0;
        return list[0];
      }
      index++;
      return list[index];
    }
  };
};
var NicoView = function() {
  var domain = 'http://gong023.com:4567/nicoplay/';
  //var thumbnail_domain = 'http://tn-skr1.smilevideo.jp/smile?i=18267644';
  var thumbnail_domain = 'http://tn-skr1.smilevideo.jp/smile';
  return {
    'togglePlayer' :function(title) {
      if (location.href == domain + '#pre') {
        document.getElementById('post_title').innerHTML = title;
        this.changeLocation("#post", "slide");
      } else {
        document.getElementById('pre_title').innerHTML = title;
        this.changeLocation("#pre", "slide");
      }
    },
    'changeLocation' :function(ref, animation) {
      $.mobile.defaultPageTransition = 'slide';
      $.mobile.changePage(ref, animation, true, true);
    },
    'displayThumbnail' :function(video_id) {
      var video_id = video_id.replace(/^sm/, '');
      var thumbnail_src = thumbnail_domain + "?i=" + video_id;
      var img = document.createElement('img');
      img.setAttribute('src', thumbnail_src);
      img.setAttribute('width', 260);
      img.setAttribute('height', 200);
      if (location.href == domain + '#pre') {
        img.setAttribute('id', 'pre_thumbnail');
        document.getElementById('pre_thumbnail_area').appendChild(img);
        var remove = document.getElementById('post_thumbnail');
        if (remove) {
          document.getElementById('post_thumbnail_area').removeChild(remove);
        }
      } else {
        img.setAttribute('id', 'post_thumbnail');
        document.getElementById('post_thumbnail_area').appendChild(img);
        var remove = document.getElementById('pre_thumbnail');
        if (remove) {
          document.getElementById('pre_thumbnail_area').removeChild(remove);
        }
      }
    }
  };
}
var nicoutil = {
  'parseDate' :function(date) {
    return date.match(/^[0-9]+-[0-9]+-[0-9]+/);
  },
  'addStrings' :function(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    return String(x + y);
  }
};
(function() {
  MyAudio = NicoPlayer();
  Playlist = NicoPlaylist();  
})();
