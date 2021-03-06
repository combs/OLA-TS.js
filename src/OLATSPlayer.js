import BufferedOLATS from "./BufferedOLATS.js";

export function OLATSPlayer(audioContext, audioBuffer, frameSize, bufferSize, windowType) {

  var _audioCtx = audioContext;

  var _node = audioContext.createScriptProcessor(bufferSize, 2);
  
  var _windowType = windowType || 'Lanczos';
  
  var _pv = new BufferedOLATS(frameSize, _windowType);

  var _audioBuffer = audioBuffer;

  _pv.set_audio_buffer(audioBuffer);

  var _newAlpha = 1;

  var _newPosition = 0;

  var _canPlay = false;


  _node.onaudioprocess = function(e) {
    if (_canPlay) {
      if (_newAlpha != undefined) {
        _pv.alpha = _newAlpha;
        _newAlpha = undefined;
      }

      if (_newPosition != undefined) {
        _pv.position = _newPosition;
        _newPosition = undefined;
      }

      _pv.process(e.outputBuffer);
    } 
  }

  this.play = function() {
    this.connect(this.destination);
    _canPlay = true;
  }

  this.stop = function() {
    _canPlay = false;
    this.disconnect();
  }

  this.connect = function(destination) {
    this.destination = destination;
    _node.connect(destination);
  }

  this.disconnect = function() {
    _node.disconnect();
  }

  Object.defineProperties(this, {
    'position' : {
      get : function() {
        return _newPosition || _pv.position;
      }, 
      set : function(newPosition) {
        _newPosition = newPosition;
      }
    },
    'playing' : {
      get : function() {
        return _canPlay;
      }
    },
    'speed' : {
      get : function() {
        return _newAlpha || _pv.alpha;
      },
      set : function(newSpeed) {
        _newAlpha = newSpeed;
      }
    },
    'context' : {
      get : function() {
        return _audioCtx;
      }
    },
    'audioBuffer' : {
      get : function() {
        return _audioBuffer;
      }
    }
  })
}

export default OLATSPlayer ;