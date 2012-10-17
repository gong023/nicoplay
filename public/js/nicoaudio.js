var nicoplayer = function(){
  var current_audio = null;
  var domain = 'http://gong023.com/nicoplay/'
  return {
    'init' :function() {
      current_audio = new Audio("");
      if (! current_audio.canPlayType) {
        alert('browser does not support');
      }
      current_audio.autoplay = false;
    },
    'play' :function(date, title) {
      if (current_audio === null) {
        alert('audio is not found');
      }
      current_audio.src = domain + "audio/all/" + date + "/" + title + ".mp4.mp3";
      //current_audio.src = 'http://gong023.com/nicoplay/public/audio/all/2012-09-23/freedom.mp3';
      current_audio.controls = true;
      console.log(current_audio);
      current_audio.play();
    },
    'pause' :function() {
      if (current_audio === null) {
        alert('audio is not found');
      }
      current_audio.pause();
    }
  };
};
(function() {
  nicoaudio = nicoplayer();
  nicoaudio.init();
})();
