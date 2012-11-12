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
      current_audio.addEventListener('ended', this.playNext);
      Playlist.init(index);
      var playing = Playlist.getPlaying(Playlist.getIndex());
      my_view.togglePlayer(playing.title);
      this.play();
      if (prepare_timer == null) {
        setInterval("MyAudio.prepareNext()", 1500);
      }
    },
    'prepareNext' :function() {
      console.log('preparing');
      if (do_next === false) {
        console.log('prepared');
        console.log(next_audio);
        return;
      }
      var next_index = nicoutil.addStrings(Playlist.getIndex(), 1);
      next_audio = new Audio(this.getSrc(next_index));
      next_audio.autoplay = false;
      do_next = false;
    },
    'getSrc' :function(index) {
      index = index || Playlist.getIndex();
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
        current_audio.play();
        return;
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
      var next = Playlist.next();
      my_view.togglePlayer(next.title);
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
