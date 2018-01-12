import $ from 'jquery'
class WindowScroller{
  constructor(){
    this.$window = $(window);
  }

  smooth(y, friction){

    let current = this.getCurrent();
    const interval = setInterval(()=>{

      const diff = y - current;
      const to = current + diff*friction;

      window.scrollTo(0, to);
      current = to;

      if(Math.abs(diff) < 0.1){
        clearInterval(interval);
      }
    }, 60/1000);

  }

  jump(y){
    window.scrollTo(0, y);
  }

  getCurrent(){
    return this.$window.scrollTop();
  }


}

export default new WindowScroller();
