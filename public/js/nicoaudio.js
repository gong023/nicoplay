var NicoPlayer = function(){
  var current_audio = null;
  var domain = 'http://gong023.com/nicoplay/';
  var pre = true;
  return {
    'init' :function(index) {
      current_audio = new Audio("");
      if (! current_audio.canPlayType) {
        alert('browser does not support');
      }
      $.mobile.defaultPageTransition = 'slide';
      current_audio.autoplay = false;
      current_audio.controls = true;
      current_audio.addEventListener('ended', this.playNext);
      playlist.init(index);
      var playing = playlist.getPlaying();
      document.getElementById("pre_title").innerHTML = playing.title;
      $.mobile.changePage('#pre', 'slide', true, true);
      this.play();
    },
    'getSrc' :function() {
      var playing = playlist.getPlaying();
      var date = nicoutil.parseDate(playing.ctime);
      return domain + "public/audio/all/" + date + "/" + playing.video_id + ".mp3";
    },
    'play' :function() {
      if (current_audio === null) {
        alert('audio is not foud');
      }
      current_audio.src = this.getSrc();
      //current_audio.src = "http://taira-komori.jpn.org/sound/gamesf01/Surprise1.mp3";
      current_audio.play();
    },
    'pause' :function() {
      if (current_audio === null) {
        alert('audio is not found');
      }
      location.href = "#playlist";
      current_audio.pause();
    },
    'playNext' :function() {
      var next = playlist.next();
      if (pre == true) {
        document.getElementById("post_title").innerHTML = next.title;
        $.mobile.changePage('#post', 'slide', true, true);
        pre = false;
      } else {
        document.getElementById("pre_title").innerHTML = next.title;
        $.mobile.changePage('#pre', 'slide', true, true);
        pre = true;
      }
      audio.play();
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
    'getPlaying' :function(){
      return list[index];
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
var nicoutil = {
  'parseDate' :function(date) {
    return date.match(/^[0-9]+-[0-9]+-[0-9]+/);
  }
};
(function() {
  audio = NicoPlayer();
  playlist = NicoPlaylist();  
})();
