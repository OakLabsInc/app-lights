

const { join } = require('path')
const QuickgRPC = require('quick-grpc')
const _ = require('lodash')

let lightsInfo = false

class Lights {
  constructor (opts, cb = function () {}) {
    let _this = this
    _this.controllerId = ''
  }
}



getLightsInfo(function (err, newInfo) {
  if (err) {
    // retry lights.info if it fails
    lightsInfo = false
    return setTimeout(function () {
      getLightsInfo()
    }, 3000)
  }
  lightsInfo = newInfo
  Lights.controllerId = newInfo.controllers[0].controllerId
})


//using as a health check for lights
async function getLightsInfo (cb = function () {}) {
  console.log('LIGHTS_HOST', process.env.LIGHTS_HOST)
  let { oakLights } =  await new QuickgRPC({
    host: process.env.LIGHTS_HOST || 'localhost:9100',
    basePath: join(__dirname, 'oak-lights')
  })
  
  let lights = await oakLights()
  
  lights.info(undefined, cb)
}

//using as a health check for lights
async function changeLights (request, cb = function () {}) {

  if (!lightsInfo) return false

  request.controllerId = Lights.controllerId

  let { oakLights } =  await new QuickgRPC({
    host: process.env.LIGHTS_HOST || 'localhost:9100',
    basePath: join(__dirname, 'oak-lights')
  })

  let lights = await oakLights()
  console.log("Lights Change Request:\n", request)
  lights.changeColor(request, function (err) {
    if (err) throw err
    cb(err, request)
  })
}





//this returns modular exports
module.exports.getLightsInfo = getLightsInfo
module.exports.changeLights = changeLights

