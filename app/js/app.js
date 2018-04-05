import $ from 'jquery'

class App{
  constructor(){
    console.log("app ready!");
    console.log("env: "+ENV.env);
    this.sequence()
  }

  async sequence(){
    console.log("--- 0 ---")
    await this.asyncFunc(1000)
    console.log("--- 1 ---")
    await this.asyncFunc(1000)
    console.log("--- 2 ---")
    await this.asyncFunc(1000)
  }

  async asyncFunc(time){
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        console.log("wait "+time)
        resolve();
      }, time)
    });
  }

}

$(document).ready(()=>{
  const app = new App();
});


