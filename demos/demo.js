import { DragAndDrop } from "./drag-and-drop.js"
import { OLATSPlayer } from "../src/OLATS.js"
import { OLATSPlayerUI } from "../src/OLATSPlayerUI.js"

var BUFFER_SIZE = 4096;
var FRAME_SIZE  = 4096;

var players = [];
var playersIdCounter = 0;


var load_remote_audio = function(url) {
  if (!window.context) { 
    window.context = new AudioContext();
  }
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
      context.decodeAudioData(request.response, function(decodedData) {
        add_player(request.responseURL, decodedData);
      });
  };
  request.send();
};

var load_local_audio = function(e) {
  if (!window.context) { 
    window.context = new AudioContext();
  }
    
  if (e.dataTransfer.files.length) {

          // Create file reader
          var reader = new FileReader();
          reader.addEventListener('progress', function (e) {
              console.log(e);
          });
          reader.addEventListener('load', function (e) {
              context.decodeAudioData(e.target.result, function(decodedData) {
                console.log("audio decoded, loading player.")
                add_player(filename, decodedData);
              });
          });
          reader.addEventListener('error', function () {
              alert('Error reading file');
              console.error('Error reading file');
          });

          var filename = e.dataTransfer.files[0].name;
          reader.readAsArrayBuffer(e.dataTransfer.files[0].slice());

      } else {
          alert('Not a file');
          console.error('Not a file');
      }
}

var add_player = function(title, decodedData) {
  if (!window.context) { 
    window.context = new AudioContext();
  }
    
  var id = playersIdCounter++;
  var player = new OLATSPlayer(window.context, decodedData, FRAME_SIZE, BUFFER_SIZE);
  var gain = windowcontext.createGain();

  var ui = new OLATSPlayerUI(id, title, player, gain);
  ui.removeCallback = function() {
    player.disconnect();
    gain.disconnect();
    delete players[id];
  }

  players[id] = {
    player : player,
    gain : gain, 
    ui : ui
  };

  player.connect(gain);
  gain.connect(window.context.destination);
}

var dd = new DragAndDrop(document.getElementById('drag-and-drop'));
dd.on('drop', load_local_audio);


var remoteURLs = [
  {
    title: 'SuperNova - Airport (Trance)', 
    url: 'https://storage.jamendo.com/download/track/480405/mp32/', 
  }, 
  {
    title: 'Sim Band - Let\'s Rock (Rock)',
    url: 'https://storage.jamendo.com/download/track/639882/mp32/'
  },
  {
    title: 'Joka L. - Quiet Night (Classica)',
    url: 'https://storage.jamendo.com/download/track/549412/mp32/'
  }
];

for (var i=0; i<remoteURLs.length; i++) {
  var a = document.createElement('a');
  a.href = "#";
  a.url = remoteURLs[i].url;
  a.onclick = function() {
    load_remote_audio(this.url);
  }
  a.innerHTML = remoteURLs[i].title;
  var p = document.createElement('p');
  p.appendChild(a);
  document.getElementById('remote-files').appendChild(p);
}
