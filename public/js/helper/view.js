var NicoView = function() {
  var domain = 'http://gong023.com:9292/nicoplay/';
  var thumbnail_domain = 'http://tn-skr1.smilevideo.jp/smile';
  var scroll_msg = null;
  var changeLocation = function(ref, animation, is_reverse) {
    $.mobile.defaultPageTransition = 'slide';
    $.mobile.changePage(ref, {transition: animation, reverse: is_reverse});
  }
  var removeChildrenById = function(elem_id) {
    var elem = document.getElementById(elem_id);
    if (elem.hasChildNodes()) {
      while(elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
    }
  }
  var scrollTitle = function(id) {
    scroll_msg = scroll_msg.substring(1, scroll_msg.length) + scroll_msg.substring(0, 1);
    document.getElementById(id).innerHTML = scroll_msg;
    setTimeout(function(){scrollTitle(id);}, 500);
  }
  return {
    togglePlayer :function(title, reverse) {
      var reverse = reverse || false;
      var append = Math.round(title.length * 0.4);
      scroll_msg = title;
      for (var i = 0; i <= append; i ++ ) {
        scroll_msg = scroll_msg + '　';
      }
      if (location.href == domain + '#pre') {
        setTimeout(scrollTitle('post_title'), 1000);
        changeLocation("#post", "slide", reverse);
      } else {
        setTimeout(scrollTitle('pre_title'), 1000);
        changeLocation("#pre", "slide", reverse);
      }
      this.setShuffleSlider();
    },
    backToPlaylist :function() {
        changeLocation('#playlist', 'slide', true);
        removeChildrenById('post_thumbnail_area');
        removeChildrenById('pre_thumbnail_area');
        for (var i = 0; i < 100; i++) {
          window.clearInterval(i);
        }
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
