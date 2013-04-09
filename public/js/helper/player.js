var NicoPlayer = function(){
  var current_audio = null;
  var prepare_timer = null;
  var next_audio = null;
  var do_next = true;
  var url = 'http://gong023.com/nicoplay/';
  var my_view = NicoView();
  var getSrc = function(index) {
    var index = index || Playlist.getIndex();
    var playing = Playlist.getPlaying(index);
    var date = nicoutil.parseDate(playing.ctime);
    return url + "public/audio/all/" + date + "/" + playing.video_id + ".mp3";
  };
  var fileExists = function(src) {
    return true;
    //var req = new XMLHttpRequest();
    //req.open('GET', src, false);
    //req.send();
    //return req.status == 200;
  };
  return {
    init :function(index) {
      current_audio = new Audio("");
      if (current_audio.canPlayType('audio/mpeg') == '') {
        alert('browser does not support');
        return;
      }
      current_audio.autoplay = false;
      Playlist.init(index);
      var playing = Playlist.getPlaying(Playlist.getIndex());
      my_view.togglePlayer(playing.title);
      my_view.displayThumbnail(playing.video_id);
      this.play();
      if (prepare_timer == null) {
        //setInterval("MyAudio.prepareNext()", 4000);
      }
    },
    prepareNext :function() {
      if (do_next === false) {
        return;
      }
      var next_index = nicoutil.addStrings(Playlist.getIndex(), 1);
      var src = (getSrc(next_index)) ? getSrc(next_index) : getSrc(0);
      try {
        next_audio = new Audio(src);
        next_audio.autoplay = true;
        next_audio.preload = 'auto';
      } catch (err) {
        console.log(err.message);
        return;
      }
      //next_audio.onloadstart = console.log('next audio start loading');
      //next_audio.onloadeddata = console.log('next audio end loading:' + next_audio.src);
      do_next = false;
    },
    play :function() {
      do_next = true;
      if (next_audio !== null && next_audio.src == getSrc()) {
        current_audio = next_audio;
        next_audio = null;//kimoi
      } else {
        current_audio.src = getSrc();
      }
      if (current_audio === null || fileExists(current_audio.src) == false) {
        alert('audio is not foud');
        return;
      }
      //current_audio.src = "http://taira-komori.jpn.org/sound/gamesf01/Surprise1.mp3";
      current_audio.addEventListener('ended', this.playNext);
      current_audio.play();
    },
    pause :function(go_back) {
      if (current_audio) current_audio.pause();
      var go_back = go_back || false;
      if (go_back) my_view.backToPlaylist();
    },
    playNext :function() {
      var next = Playlist.next();
      my_view.togglePlayer(next.title);
      my_view.displayThumbnail(next.video_id);
      MyAudio.play();
    },
    playPrevious :function() {
      var previous = Playlist.previous();
      var reverse = true;
      my_view.togglePlayer(previous.title, reverse);
      my_view.displayThumbnail(previous.video_id);
      MyAudio.play();
    }
  };
};

define(["helper/playlist", "helper/util", "helper/view"], function() {
  return NicoPlayer;
});
