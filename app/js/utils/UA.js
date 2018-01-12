
class UA{

  constructor(){
    let _uac = {};
    let ua = window.navigator.userAgent.toLowerCase();
    let ver = window.navigator.appVersion.toLowerCase();

    // check browser version
    _uac.browser = (()=>{
        if (ua.indexOf('edge') !== -1) return 'edge';                           // Edge
        else if (ua.indexOf("iemobile") !== -1)      return 'iemobile';         // ieMobile
        else if (ua.indexOf('trident/7') !== -1)     return 'ie11';             // ie11
        else if (ua.indexOf("msie") !== -1 && ua.indexOf('opera') === -1){
            if      (ver.indexOf("msie 6.")  !== -1) return 'ie6';              // ie6
            else if (ver.indexOf("msie 7.")  !== -1) return 'ie7';              // ie7
            else if (ver.indexOf("msie 8.")  !== -1) return 'ie8';              // ie8
            else if (ver.indexOf("msie 9.")  !== -1) return 'ie9';              // ie9
            else if (ver.indexOf("msie 10.") !== -1) return 'ie10';             // ie10
        }
        else if (ua.indexOf('chrome')  !== -1 && ua.indexOf('edge') === -1)   return 'chrome';    // Chrome
        else if (ua.indexOf('safari')  !== -1 && ua.indexOf('chrome') === -1) return 'safari';    // Safari
        else if (ua.indexOf('opera')   !== -1) return 'opera';                  // Opera
        else if (ua.indexOf('firefox') !== -1) return 'firefox';                // FIrefox
        else return 'unknown_browser';
    })();

    // check device
    _uac.device = (()=>{
        if(ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1 ) return 'iphone';
        else if (ua.indexOf('ipad')    !== -1) return 'ipad';
        else if (ua.indexOf('android') !== -1) return 'android';
        else if (ua.indexOf('windows') !== -1 && ua.indexOf('phone') !== -1) return 'windows_phone';
        else return '';
    })();

    // check ios version
    _uac.iosVer = (()=>{
        if ( /iP(hone|od|ad)/.test( navigator.platform ) ) {
            var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
            var versions = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
            return versions[0];
        }
        else return 0;
    })();

    this.isiOS = (_uac.device === 'iphone' || _uac.device === 'iPad');
    this.isMobile = (ua.indexOf('mobi') !== -1 || _uac.device === 'iphone' || (_uac.device === 'windows_phone' && ua.indexOf('wpdesktop') === -1) || _uac.device === 'iemobile');
    this.isTablet = (_uac.device === 'ipad' || (_uac.device === 'android' && !this.isMobile));
    this.isTouch  = ('ontouchstart' in window);
    this.isModern = !(_uac.browser === 'ie6' || _uac.browser === 'ie7' || _uac.browser === 'ie8' || _uac.browser === 'ie9' || (0 < _uac.iosVer && _uac.iosVer < 8));
    this.androidVersion = this.checkAndroidVersion(ua);
  }

  checkAndroidVersion(ua) {
  if( ua.indexOf("android") > 0 )
    {
      var version = parseFloat(ua.slice(ua.indexOf("android")+8));
      return version;
    }
    return 0;
  }

  IsMobile(){
    if(this.isMobile != true){
      return false;
    }

    if(this.isTablet == true){
      return false;
    }

    return true;


  }

  IsPC(){
    if(this.isMobile || this.isTablet){
      return false;
    }else{
      return true;
    }
  }
}

const ua = new UA();
export default ua;
