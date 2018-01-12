import $ from 'jquery'
import 'whatwg-fetch'

class SVGReplacer{
  constructor(){

  }

  execute(){
    $("img").each( (i, e) => {
      const src = $(e).attr('src')
      const _class = $(e).attr('class')
      if( /\.svg$/.test(src) ){
        $(e).css({opacity: 0.1})
        fetch(src, {
            mode: 'cors',
            credentials: 'include'
          })
          .then( res => res.text() )
          .then( svg => {
            const className = $(e).attr('class')
            const parent = $(e).parent('class')
            const $svg = $(svg).addClass(className)
            $(e).replaceWith($svg)
            $svg.css({opacity: 1.0})
            // console.log("complete");
          })
      }
    });
  }

  executeAsync($elem=$('img'), name=""){
    const sum = $elem.length;
    let progress = 0;
    return new Promise((resolve)=>{
      $elem.each( (i, e) => {
        const src = $(e).attr('src')
        // console.log(src);
        if( /\.svg$/.test(src) ){
          $(e).css({opacity: 0.1})
          fetch(src, {
              mode: 'cors',
              credentials: 'include'
            })
            .then( res => res.text() )
            .then( svg => {
              const className = $(e).attr('class')
              const idName = $(e).attr('id')
              const parent = $(e).parent('class')
              const $svg = $(svg).addClass(className)
              if(name != ""){
                $svg.attr('id', name+progress);
                $svg.addClass(name);
              }
              $(e).replaceWith($svg)
              // $svg.css({opacity: 1.0})
              progress++;
              if(progress == sum){
                resolve();
              }
            })
        }else{
          progress++;
        }
      });
    });
  }

}
export default new SVGReplacer();
