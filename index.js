var async = require('async')
var himawari = require('himawari')
var mkdirp = require('mkdirp')
var moment = require('moment')
var fs = require('fs')
var path = require('path')

var INTERVAL = 10 // Time interval (in minutes)
var OUTDIR = path.resolve('images') // image output directory
var CONCURRENCY = 10
var ZOOM = 1

// string coercion shortcut
function str (x) { return '' + x }
function pad (x) {
  var y = str(x)
  while (y.length < 2) y = '0' + y
  return y
}

// Create a list of dates from `start` to `end` at a frequency of `interval` minutes
function run (opts, callback) {
  var NOW = new Date()
  var YESTERDAY = new Date(moment().subtract(1, 'days').format())

  opts = opts || {}
  opts.start = opts.start || YESTERDAY
  opts.end = opts.end || NOW
  opts.interval = opts.interval || INTERVAL
  opts.outdir = opts.outdir || OUTDIR
  opts.debug = opts.debug || false
  opts.concurrency = opts.concurrency || CONCURRENCY
  opts.zoom = opts.zoom || ZOOM
  opts.infrared = opts.infrared || false
  opts.parallel = opts.parallel || false

  var diffMs = opts.end - opts.start
  var diffSeconds = Math.floor(diffMs / 1000)
  var diffMinutes = Math.floor(diffSeconds / 60)
  var intervals = Math.floor(diffMinutes / opts.interval)
  var minutes = 0

  // set up worker queue
  var dates = async.queue(function (date, queueCallback) {
    var filename = date.getTime()

    var outfile = path.join(opts.outdir,
      opts.infrared ? 'infrared' : 'visible',
      str(opts.zoom),
      str(date.getUTCFullYear()),
      pad(date.getUTCMonth() + 1),
      pad(date.getUTCDate()),
      `${pad(date.getUTCHours())}.${pad(date.getUTCMinutes())}.jpg`)

    mkdirp.sync(path.dirname(outfile))

    if (fs.existsSync(outfile)) {
      if (opts.debug) console.log(`${filename}: already exists, skipping`)
      return queueCallback()
    }

    himawari({
      outfile: outfile,
      zoom: opts.zoom,
      date: date,
      debug: opts.debug,
      infrared: opts.infrared,
      parallel: opts.parallel,
      success: function () {
        if (opts.debug) console.log(`${filename}: success`)
        if (opts.onFileSuccess) opts.onFileSuccess(outfile)
        return queueCallback()
      },
      error: function (err) {
        console.error(`${filename}: ${err.message}`)
        return queueCallback(err)
      }
    })
  }, opts.concurrency)

  dates.drain = function () {
    if (opts.debug) console.log('all dates have been processed')
    if (callback) return callback()
  }

  for (var i = 0; i <= intervals; i++) {
    var date = new Date(opts.start)
    date.setMinutes(minutes)
    dates.push(date)
    minutes += opts.interval
  }
}

module.exports = run
