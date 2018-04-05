import $ from 'jquery'
import 'whatwg-fetch'
import 'babel-polyfill'

class SVGReplacer{
  constructor(){
  }

  async execute(cls){
    const $elems = $(cls);

    const task = $elems.map((i, e) =>{
      const $e = $(e);
      const src = $e.attr('src')
      const _class = $e.attr('class')
      return this.replace($e, src);
    });
    return $.when.apply($, task);


  }


  replace($e, src){

    return new Promise((resolve, reject)=>{

      fetch(src, {
        mode: 'cors',
        credentials: 'include'
      })
      .then(res => res.text() )
      .then(svg => {
        $e.replaceWith($(svg))
        resolve();
      })
    })

  }
  　

}
export default new SVGReplacer();
