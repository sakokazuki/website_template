import EventEmitter from 'wolfy87-eventemitter'

class ScrollEmitter extends EventEmitter{
  constructor(){
    super();


    window.onscroll = this.onScroll.bind(this);
  }

  addTop(listener){
    this.on('top', listener);
    this.onScroll();
  }

  removeTop(listener){
    this.off('top', listener);
  }

  onScroll(){
    const pos = document.body.scrollTop || document.documentElement.scrollTop;
    this.emit('top', pos);
  }
}

export default new ScrollEmitter();
