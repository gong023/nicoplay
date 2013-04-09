//(function() {
//  MyAudio = NicoPlayer();
//  Playlist = NicoPlaylist();  
//})();
require(["lib/jquery-1.7.1.min.js"], ["lib/jquery.mobile-1.1.0.min.js"], ["helper/player"], ["helper/playlist"],
        function($, $.mobile, player, playlist) {
  MyAudio = player();
  Playlist = playlist();
});
