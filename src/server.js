
const debug = process.env.NODE_ENV !== 'production'

const oak = require('oak')
const { join } = require('path')
const _ = require('lodash')
const tools = require('oak-tools')

oak.catchErrors()

const express = require('express')
const stylus = require('stylus')
const app = express()

const port = process.env.PORT ? _.toNumber(process.env.PORT) : 9000
const platform = require(join(__dirname, 'platform'))

const logger = tools.logger({
  level: debug ? 'debug' : 'info',
  pretty: debug
})

let publicPath = join(__dirname, 'public')
let viewsPath = join(__dirname, 'views')

let window = null

app.set('views', viewsPath)
app.set('view engine', 'pug')
app.use(stylus.middleware({
  src: viewsPath,
  dest: publicPath
}))
app.use(express.static(publicPath))

app.listen(port, function () {
  oak.on('ready', () => loadWindow())
})

app.get('/', function (req, res) {
  res.render('index')
})
// accept the api call from angular and return the available wifi networks
app.get('/wifi/available', function (req, res) {
  platform.getWifiScan(function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
    }
  })
})

app.get('/wifi/known', function (req, res) {
  platform.getKnownWifiNetworks(function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
    }
  })
})

app.get('/wifi/add', function (req, res) {
  let wifi = JSON.parse(req.query.wifi)
  platform.addWifi(wifi, function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
    }
  })
})

app.get('/wifi/forget', function (req, res) {
  let ssid = req.query.ssid
  platform.forgetWifi({ 'ssid': ssid }, function (err, results) {
    if (err) {
      res.status(404).send()
    } else {
      res.json(results)
    }
  })
})

async function loadWindow () {
  logger.info({
    message: `Started on port ${port}`
  })
  window = oak.load({
    url: `http://localhost:${port}/`,
    ontop: false,
    insecure: true,
    flags: ['enable-vp8-alpha-playback'],
    sslExceptions: ['localhost'],
    background: '#ffffff',
    scripts: [
      {
        name: 'lodash',
        path: 'lodash'
      },
      {
        name: 'uuid',
        path: 'uuid'
      },
      join(__dirname, '..', 'node_modules', 'angular'),
      join(__dirname, '..', 'node_modules', 'angular-animate'),
      join(__dirname, '..', 'node_modules', 'angular-aria'),
      join(__dirname, '..', 'node_modules', 'angular-messages'),
      join(__dirname, '..', 'node_modules', 'angular-material')
    ]
  })
    .on('ready', function () {

      platform.getLightsInfo()

      if (debug) {
        window.debug()
      }
    })
    .on('log.*', function (props) {
      logger[this.event.replace('log.', '')](props)
    })
    //change lights
    .on('lights.change', function (toChange) {
      platform.changeLights(toChange)
    })
}
