import $ from 'jquery'


class Sub{
  constructor(){
    console.log("sub ready");
    console.log("env: "+ENV.env);
  }


}

$(document).ready(()=>{
  const sub = new Sub();
});


