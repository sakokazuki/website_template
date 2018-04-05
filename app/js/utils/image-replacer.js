import $ from 'jquery'

class ImageReplacer{
  constructor(){

  }

  execute($elems){

    $elems.each( (i, e) => {
      const $old = $(e);
      const src = $old.attr('src')
      const className = $old.attr('class')
      const img = new Image();
      img.onload = ()=>{
        const $img = $(img);
        $old.before($img[0]);
        $img.addClass(className)
        $old.remove();
      }
      img.src = src;
    });
  }



}
export default new ImageReplacer();
