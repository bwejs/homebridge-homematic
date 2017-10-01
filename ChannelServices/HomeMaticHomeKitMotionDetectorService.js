'use strict';

var HomeKitGenericService = require('./HomeKitGenericService.js').HomeKitGenericService;
var util = require("util");


function HomeMaticHomeKitMotionDetectorService(log,platform, id ,name, type ,adress,special, cfg, Service, Characteristic) {
    HomeMaticHomeKitMotionDetectorService.super_.apply(this, arguments);
}

util.inherits(HomeMaticHomeKitMotionDetectorService, HomeKitGenericService);


HomeMaticHomeKitMotionDetectorService.prototype.createDeviceService = function(Service, Characteristic) {

    var that = this;
    var sensor = new Service["MotionSensor"](this.name);
    var state = sensor.getCharacteristic(Characteristic.MotionDetected)
	.on('get', function(callback) {
      that.query("MOTION",function(value){
       if (callback) callback(null,value);
      });
    }.bind(this));

    this.currentStateCharacteristic["MOTION"] = state;
    state.eventEnabled = true;
    this.services.push(sensor);
    this.remoteGetValue("MOTION");
    
	var brightness = new Service["LightSensor"](this.name);
 	var cbright = brightness.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
      .on('get', function(callback) {
         that.query("BRIGHTNESS",function(value){
	         if (callback) {callback(null,value/10)} //dont know how to calculate lux from HM Values ...
          });
     }.bind(this));
 
     this.currentStateCharacteristic["BRIGHTNESS"] = cbright;
     cbright.eventEnabled= true;
	 this.services.push(brightness);
	 this.remoteGetValue("BRIGHTNESS");
	 
	this.addTamperedCharacteristic(sensor,Characteristic);
	this.addLowBatCharacteristic(sensor,Characteristic);
}



module.exports = HomeMaticHomeKitMotionDetectorService; 