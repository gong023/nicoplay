var NicoPlayer = function(){
  var current_audio = null;
  var domain = 'http://gong023.com/nicoplay/'
  return {
    'init' :function() {
      current_audio = new Audio("");
      if (! current_audio.canPlayType) {
        alert('browser does not support');
      }
      current_audio.autoplay = false;
      current_audio.controls = true;
      current_audio.addEventListener('ended', this.playNext);
    },
    'play' :function(ctime, video_id, current_playing) {
      if (current_audio === null) {
        alert('audio is not foud');
      }
      location.href = "#pre_player";
      var date = nicoutil.parseDate(ctime);
      current_audio.src = domain + "public/audio/all/" + date + "/" + video_id + ".mp3";
      //current_audio.src = "http://taira-komori.jpn.org/sound/gamesf01/Surprise1.mp3";
      console.log(current_audio.src);
      current_audio.play();
      playlist.init(current_playing);//やだ
    },
    'pause' :function() {
      if (current_audio === null) {
        alert('audio is not found');
      }
      location.href = "#playlist";
      current_audio.pause();
    },
    'playNext' :function() {
      location.href = "#post_player";
      var next = playlist.next();
      audio.play(next.ctime, next.video_id, playlist.getIndex());
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
    'getIndex' :function(){
      return index;
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
  audio.init();
  playlist = NicoPlaylist();  
})();
