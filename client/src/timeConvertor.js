function convertTime(time, addon = "") { // clf
  if(!time) return "";

  time = parseInt(time);
  time /= 1000;
  
  let a = (new Date()).getTime() / 1000,
      c = c1 => a - time < c1,
      d = Math.round;

  if(c(60)) {
    return d((a - time)) + "s" + addon;
  } else if(c(3600)) {
    return d((a - time) / 60) + "m" + addon;
  } else if(c(86400)) {
    return d((a - time) / 3600) + "h" + addon;
  } else if(c(604800)) {
    return d((a - time) / 86400) + "d" + addon;
  } else if(c(2419200)) {
    return d((a - time) / 604800) + "w" + addon;
  } else if(time < 0) {
    return "";
  } else {
    let e = new Date(time * 1000),
        f = [
          "Jan",
          "Feb",
          "March",
          "Apr",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ][e.getMonth()];
    return `${ f } ${ e.getDate() }, ${ e.getFullYear() } ${ e.getHours() }:${ e.getMinutes() }`;
  }
}

export { convertTime }