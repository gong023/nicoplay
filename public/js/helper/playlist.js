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

define(["helper/player", "helper/util", "helper/view"], function() {
  return NicoPlaylist;
});
