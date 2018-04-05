
import EventEmitter from 'wolfy87-eventemitter'


class ResizeEmitter extends EventEmitter{

  constructor(){
    super();
    this.updateTime = 200;

    this.resized = this.resized.bind(this);
    this.windowResizeFunction = ()=>{
      this.eve();
    }

    window.addEventListener("resize", this.resized);
  }

  on(listener){
    super.on('resize', listener);
    listener(this.getSize());
  }

  off(listener){
    super.off('resize', listener);
  }

  resized(){
    if (this.t !== false) {
      clearTimeout(this.t);
    }
    this.t = setTimeout(()=> {
       this.emit('resize', this.getSize());
    }, this.updateTime);
  }

  getSize(){
    return {w: window.innerWidth, h: window.innerHeight};
  }


}

export default new ResizeEmitter();
