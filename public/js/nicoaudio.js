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
        setInterval("MyAudio.prepareNext()", 4000);
      }
    },
    prepareNext :function() {
      if (do_next === false) {
        return;
      }
      var next_index = nicoutil.addStrings(Playlist.getIndex(), 1);
      var src = (getSrc(next_index)) ? getSrc(next_index) : getSrc(0);
      next_audio = new Audio(src);
      next_audio.autoplay = false;
      next_audio.preload = 'auto';
      //next_audio.onloadstart = console.log('next audio start loading');
      //next_audio.onloadeddata = console.log('next audio end loading:' + next_audio.src);
      do_next = false;
    },
    play :function() {
      do_next = true;
      if (next_audio !== null && next_audio.src == getSrc()) {
        current_audio = next_audio;
        next_audio = null;
      } else {
        current_audio.src = getSrc();
      }
      if (current_audio === null) {
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
var NicoPlaylist = function(){
  var list;
  var index;
  var is_shuffle = false;
  var getListLength = function() {
    var list_length = 0;
    for (var name in list) list_length++;
    return list_length;
  };
  return {
    init :function(current_playing) {
      this.getDefault();
      index = current_playing;
    },
    getIndex :function() {
      return index;
    },
    getPlaying :function(list_index){
      return list[list_index];
    },
    next :function() {
      index++;
      if (index >= getListLength()) {
        index = 0;
        return list[0];
      }
      return list[index];
    },
    previous :function() {
      index--;
      if (index < 0) {
        var last = getListLength() - 1;
        index = last;
        return list[last];
      }
      return list[index];
    },
    shuffle :function() {
      is_shuffle = ! is_shuffle;
      if (! is_shuffle) {
        this.getDefault();
      } else {
        var length = getListLength();
        while(length--) {
          var rand = Math.floor(Math.random() * (length + 1));
          if (length == rand) continue;
          var save = list[length];
          list[length] = list[rand];
          list[rand] = save;
        }
      }
    },
    getDefault :function() {
      list = JSON.parse(document.player.playlist.value);
    },
    isShuffle :function() {
      return is_shuffle;
    }
  };
};
var NicoView = function() {
  var domain = 'http://gong023.com:4567/nicoplay/';
  var thumbnail_domain = 'http://tn-skr1.smilevideo.jp/smile';
  var changeLocation = function(ref, animation, is_reverse) {
    $.mobile.defaultPageTransition = 'slide';
    $.mobile.changePage(ref, {transition: animation, reverse: is_reverse});
  }
  var removeChildrenById = function(elem_id) {
    var elem = document.getElementById(elem_id);
    //if (elem_id.hasChildNodes()) elem_id.removeChild(elem_id.firstChild);
    if (elem.hasChildNodes()) {
      while(elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
    }
  }
  return {
    togglePlayer :function(title, reverse) {
      var reverse = reverse || false;
      if (location.href == domain + '#pre') {
        document.getElementById('post_title').innerHTML = title;
        changeLocation("#post", "slide", reverse);
      } else {
        document.getElementById('pre_title').innerHTML = title;
        changeLocation("#pre", "slide", reverse);
      }
      this.setShuffleSlider();
    },
    backToPlaylist :function() {
        changeLocation('#playlist', 'slide', true);
        removeChildrenById('post_thumbnail_area');
        removeChildrenById('pre_thumbnail_area');
    },
    displayThumbnail :function(video_id) {
      var video_id = video_id.replace(/^sm/, '');
      var thumbnail_src = thumbnail_domain + "?i=" + video_id;
      var img = document.createElement('img');
      img.setAttribute('src', thumbnail_src);
      img.setAttribute('width', 260);
      img.setAttribute('height', 200);
      if (location.href == domain + '#pre') {
        img.setAttribute('id', 'pre_thumbnail');
        document.getElementById('pre_thumbnail_area').appendChild(img);
        removeChildrenById('post_thumbnail_area');
      } else {
        img.setAttribute('id', 'post_thumbnail');
        document.getElementById('post_thumbnail_area').appendChild(img);
        removeChildrenById('pre_thumbnail_area');
      }
    },
    setShuffleSlider :function() {
      var options = document.getElementsByTagName("option");
      if (Playlist.isShuffle()) {
        //on
        options[1].setAttribute('selected', true);
        options[3].setAttribute('selected', true);
        //off
        options[0].setAttribute('selected', false);
        options[2].setAttribute('selected', false);
      } else {
        //on
        options[1].setAttribute('selected', false);
        options[3].setAttribute('selected', false);
        //off
        options[0].setAttribute('selected', true);
        options[2].setAttribute('selected', true);
      }
    }
  };
}
var nicoutil = {
  parseDate :function(date) {
    return date.match(/^[0-9]+-[0-9]+-[0-9]+/);
  },
  addStrings :function(x, y) {
    x = parseInt(x);
    y = parseInt(y);
    return String(x + y);
  }
};
(function() {
  MyAudio = NicoPlayer();
  Playlist = NicoPlaylist();  
})();
