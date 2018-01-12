import $ from 'jquery'

class RequestUtil{
  constructor(api){
    this.api = api;
  }

  async loginAndComment(){
    const login = await this.get("api/login.json");
    // console.log(login);
    const comments = await this.get("api/static/comments.json");
    // console.log(comments);
  }

  async getQuery(resourcepath, query){
    return new Promise((resolve, reject)=>{
      $.ajax({
        url: this.api+resourcepath+"?"+query,
        xhrFields: {
          withCredentials: true
        }
      })
      .then((res)=>{
        resolve(res);
      })
      .then((err)=>{
        reject(err);
      });
    });
  }

  async get(resourcepath){
    return new Promise((resolve, reject)=>{
      const query = "?"+Math.floor((new Date()).getTime()/1000);
      $.ajax({
        url: this.api+resourcepath+query,
        xhrFields: {
          withCredentials: true
        }
      })
      .then((res)=>{
        resolve(res);
      })
      .then((err)=>{
        reject(err);
      });
    });
  }


  async post(resourcepath, obj = {}){
    return new Promise((resolve, reject)=>{
      const query = "?"+Math.floor((new Date()).getTime()/1000);
      $.ajax({
        type: "POST",
        url: this.api+resourcepath+query,
        data: obj,
        xhrFields: {
          withCredentials: true
        }
      })
      .then((res)=>{
        resolve(res);
      })
      .then((err)=>{
        reject(err);
      });
    });
  }



}

export default new RequestUtil(ENV.api);
