class GAUtil{
  constructor(){

  }

  pageview(){
    if(gtag === undefined) return;
    const id = ga.getAll().map(function(tracker) {
      return tracker.get('trackingId');
    })[0];

    const title = document.title;
    const location = window.location.href;
    const path = window.location.pathname;
    gtag('config', id, {
      'page_title': title,
      'page_location': location,
      'page_path': path
    })
  }
}

export default new GAUtil();

