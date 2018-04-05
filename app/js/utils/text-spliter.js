 import $ from 'jquery'

 class TextSpliter{
  constructor(){

  }

  execute($elem){
    const matchpattern = /(<\/?[^>]+>)|([^<]+)/g ;
    const replaced = $elem.html().replace(matchpattern, (e)=>{
      const isTag = e.match(/<("[^"]*"|'[^']*'|[^'">])*>/g);
      if(isTag){
        return e;
      }else{
        return e.split('').map((v)=>{return `<span>${v}</span>`}).join("");
      }
    });
    return $elem.html(replaced);
  }
 }

 export default new TextSpliter();
