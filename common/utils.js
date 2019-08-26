// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    //i = "0" + i; //add 0 to clock hour
    return i;
  }
  return i;
}

export function isNightTime(dimDisplay) {
  var now = new Date();
  var hours = now.getHours();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  //console.log(ampm + " " + hours + " " + dimDisplay )
  if (ampm == "AM" && hours >= 0 && hours < 7 && dimDisplay == true) {
    return true;
  } else {
    return false;
  }
}
