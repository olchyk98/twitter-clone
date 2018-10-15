// CookieControl @2018
// Oles Odynets

const cookieControl = {
  set: function(name, value, daysOut = 32) {
    let d = new Date();
    d.setTime(d.getTime() + (daysOut * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
  },
  get: function(name) {
    name += "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = JSON.parse(c.substring(1));
        }
        if (c.indexOf(name) === 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }

    return "";
  },
  delete: function(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

export default cookieControl;
