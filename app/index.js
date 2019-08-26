import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";
import { me } from "appbit";
import { today } from "user-activity";
import { display } from "display";
import { geolocation } from "geolocation";
import { user } from "user-profile";
import * as messaging from "messaging";
import document from "document";
import * as fs from "fs";
import { inbox } from "file-transfer";
import { readFileSync } from "fs";
import * as cbor from 'cbor';

let defaultSettings = {
  stringColor: '#009aed', //blue
  dateColor: '#ff7645', //red
  numberColor: "#3BF7DE" //teal
};
let settings = defaultSettings;

inbox.onnewfile = processInbox;
// Update the clock every minute
clock.granularity = "minutes"

// Get a handle on the <text> element
const hourHand = document.getElementById("hours");
const minHand = document.getElementById("mins");
const batteryDigits = document.getElementById("batteryDigits");
const selectLabel = document.getElementById("selectLabel");
const where1Label = document.getElementById("where1Label");
const andTimeLabel = document.getElementById("andTimeLabel");
const andHrActiveLabel = document.getElementById("andHrActiveLabel");
const andHrRestingLabel = document.getElementById("andHrRestingLabel");
const andHrZoneLabel = document.getElementById("andHrZoneLabel");
const andFloorsLabel = document.getElementById("andFloorsLabel");
const andMoodLabel = document.getElementById("andMoodLabel");
const andStepsLabel = document.getElementById("andStepsLabel");
const andSyncedLabel = document.getElementById("andSyncedLabel");
const andLatLabel = document.getElementById("andLatLabel");
const andLonLabel = document.getElementById("andLonLabel");

//misc colors for strings
const selectColor = document.getElementById("selectColor");
const whereColor = document.getElementById("whereColor");
const batteryColor = document.getElementById("batteryColor");
const timeColor = document.getElementById("timeColor");
const hrActiveColor = document.getElementById("hrActiveColor");
const hrRestingColor = document.getElementById("hrRestingColor");
const hrZoneColor = document.getElementById("hrZoneColor");
const stepsColor = document.getElementById("stepsColor");
const floorsColor = document.getElementById("floorsColor");
const moodColor = document.getElementById("moodColor");
const syncColor = document.getElementById("syncColor");
const innerColor = document.getElementById("innerColor");
const onColor = document.getElementById("onColor");
const latColor = document.getElementById("latColor");
const lonColor = document.getElementById("lonColor");
const nightMode = document.getElementById("nightMode");

// initialize on startup 
selectLabel.text = '';
andHrZoneLabel.text = '\'' + 'unknown' + '\'';
andMoodLabel.text = '\'' + '¯\\_(ツ)_/¯' + '\'';
andSyncedLabel.text = 0;
batteryDigits.text = '\'' + `${battery.chargeLevel}%` + '\''; 
andLatLabel.text = '00.00000';
andLonLabel.text = '00.00000';

var dimDisplay = false;

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
    hours = util.zeroPad(hours);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let monthnum = today.getMonth() + 1;
  let day = today.getDate();
  let year = today.getFullYear();
  
  var dayString = day;
  if (day < 10) {
    dayString = '0' + day;
  }
  
  var monthString = monthnum;
  if (monthnum < 10) {
    monthString = '0' + monthnum;
  }
  
  where1Label.text = '\'' + year + '-' + monthString + '-' + dayString + '\''
  andTimeLabel.text = '\'' + hours + ':' + mins + '\''
  
  var isNight = util.isNightTime(dimDisplay);
  if (isNight == true) {
    nightMode.style.visibility = "visible";
  } else {
    nightMode.style.visibility = "hidden";    
  }
}

//settings handling
function loadSettings()
{
  try {
    settings = readFileSync("settings.cbor", "cbor");
    mergeWithDefaultSettings();
  } catch (e) {
    //console.log('No settings found, fresh install, applying default settings...');
    
    //apply default settings
    settings = defaultSettings;
  }
  
  //console.log('Applying settings: ' + JSON.stringify(settings));
  applySettings();
}

function mergeWithDefaultSettings() {
  //console.log("attempting merge");
  for (let key in defaultSettings) {
    if (!settings.hasOwnProperty(key)) {
      settings[key] = defaultSettings[key];
    }
  }
}

function applySettings() { //called on launch and each time the settings are modified
  selectColor.style.fill = settings.stringColor;
  whereColor.style.fill = settings.stringColor;
  batteryColor.style.fill = settings.stringColor;
  timeColor.style.fill = settings.stringColor;
  hrActiveColor.style.fill = settings.stringColor;
  hrRestingColor.style.fill = settings.stringColor;
  hrZoneColor.style.fill = settings.stringColor;
  stepsColor.style.fill = settings.stringColor;
  floorsColor.style.fill = settings.stringColor;
  moodColor.style.fill = settings.stringColor;
  syncColor.style.fill = settings.stringColor;
  innerColor.style.fill = settings.stringColor;
  onColor.style.fill = settings.stringColor;
  latColor.style.fill = settings.stringColor;
  lonColor.style.fill = settings.stringColor;
  
  andTimeLabel.style.fill = settings.dateColor;
  batteryDigits.style.fill = settings.dateColor;
  where1Label.style.fill = settings.dateColor;
  andHrZoneLabel.style.fill = settings.dateColor;
  andMoodLabel.style.fill = settings.dateColor;
  
  andHrActiveLabel.style.fill = settings.numberColor;
  andHrRestingLabel.style.fill = settings.numberColor;
  andStepsLabel.style.fill = settings.numberColor;
  andFloorsLabel.style.fill = settings.numberColor;
  andSyncedLabel.style.fill = settings.numberColor;
  andLatLabel.style.fill = settings.numberColor;
  andLonLabel.style.fill = settings.numberColor;
  
  dimDisplay = settings.toggleNightMode;
  
  var isNight = util.isNightTime(dimDisplay);
  if (isNight == true) {
    nightMode.style.visibility = "visible";
  } else {
    nightMode.style.visibility = "hidden";    
  }
}

//load stored settings if any at startup
loadSettings();

function processInbox()
{
  let fileName;
  while (fileName = inbox.nextFile()) {
    //console.log("File received: " + fileName);

    if (fileName === 'settings.cbor') {
        loadSettings();
    }
  }
};

function locationSuccess(position) {
    andLatLabel.text = position.coords.latitude;
    andLonLabel.text = position.coords.longitude;
    //console.log("Latitude: " + position.coords.latitude,
                //"Longitude: " + position.coords.longitude);
}

function locationError(error) {
    andLatLabel.text = '00.00000';
    andLonLabel.text = '00.00000';
    //console.log("Error: " + error.code,
              //"Message: " + error.message);
}

//console.log((user.restingHeartRate || "Unknown") + " BPM");
if (user.restingHeartRate != "Unknown") {
  andHrRestingLabel.text = user.restingHeartRate; 
}

//display.brightnessOverride = 0.1; //1.0 is max, 0.1 is min
andHrActiveLabel.text = 'null';
var watchID = geolocation.watchPosition(locationSuccess, locationError);
  if (HeartRateSensor) {
    const hrm = new HeartRateSensor();
    hrm.addEventListener("reading", () => {
      andHrActiveLabel.text = hrm.heartRate
    });
    display.addEventListener("change", () => {
      // Automatically stop the sensor when the screen is off to conserve battery 
      // TODO: add time check to only update every few minutes
      display.on ? hrm.start() : hrm.stop();
      
      if (display.on) {
        if (device.lastSyncTime == undefined) {
          andSyncedLabel.text = '\'' + 'unknown' + '\'';  
        } else {
          //console.log(device.lastSyncTime);
          var diff = Math.abs(new Date() - device.lastSyncTime);
          var minutesFromMilliseconds = ((diff / 1000) / 60);
          andSyncedLabel.text = Math.round(minutesFromMilliseconds);
        }
        andHrZoneLabel.text = '\'' + user.heartRateZone(hrm.heartRate || 0) + '\'';
        geolocation.getCurrentPosition(locationSuccess, locationError)  
      } else {
        geolocation.clearWatch(watchID);
      }
    });
    hrm.start();
}

if (me.permissions.granted("access_activity")) {
   andStepsLabel.text = today.adjusted.steps;
   if (today.local.elevationGain !== undefined) {
     andFloorsLabel.text = today.adjusted.elevationGain;
   }
}

battery.onchange = (charger, evt) => {
   let batteryPercentage = battery.chargeLevel
   batteryDigits.text = '\'' + `${battery.chargeLevel}%` + '\'';
}