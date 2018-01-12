import $ from 'jquery'
import EventEmitter from 'wolfy87-eventemitter'

// pkayer api ref https://developers.google.com/youtube/iframe_api_reference?hl=ja
// player vars https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=ja

export default class YTPlayer extends EventEmitter {

  constructor(config){
    super();
    this.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
    this.load = this.load.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.pause = this.pause.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.config = config;
    this.player = null;

    if(config.initTime != 0){
      this.position = config.initTime;
    }

    if(!window.IS_YT_LOAD_STARTED){
      window.IS_YT_LOAD_STARTED = false;
      window.IS_YT_INIT = false;
    }


    if (!window.IS_YT_LOAD_STARTED) {
      window.IS_YT_LOAD_STARTED = true;
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
      this.load();
    } else if (window.IS_YT_LOAD_STARTED && !IS_YT_INIT) {
      $(window).on("ytloaded", this.onYouTubeIframeAPIReady);
    } else {
      this.onYouTubeIframeAPIReady();
    }
  }

  onYouTubeIframeAPIReady() {
    if (!window.IS_YT_INIT) {
      window.IS_YT_INIT = true;
      $(window).trigger("ytloaded");
    }
    this.config.events = {
      "onReady": this.onPlayerReady ,
      "onStateChange": this.onStateChange
    };

    this.player = new YT.Player(this.config.name, this.config);
  }

  load() {
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  play() {
    if (this.position) {
      if (this.player != null) {
        this.player.seekTo(this.position);
      }
    }

    this.player != null ? this.player.playVideo() : undefined;
  }
  stop() {
    // @position = 0
    if(!this.player) return;
    if (this.player.stopVideo) {
      this.player.stopVideo();
    }
  }
  pause() {
    this.position = this.player.getCurrentTime();
    this.player != null ? this.player.pauseVideo() : undefined;
  }

  seek(time){
    if (this.player != null) {
      this.player.seekTo(time);
    }
  }

  getState(){
    return this.state;
  }

  onPlayerReady(ev){
  }


  onStateChange(ev){
    this.state = ev.data;
    // console.log("on player satate change "+this.state)
    setTimeout(() => {
      this.emit('changeState', this.state);
      if(this.state === 2){
      }
      if (this.state === YT.PlayerState.PAUSED) {
        this.pause();
      }
      if (this.state === YT.PlayerState.ENDED) {
        this.position = 0;
        this.player.stop();
      }
    }
    , 200);
  }

  destroy(){
    this.player.destroy();
  }
}
