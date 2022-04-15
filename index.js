const async = require('async')
const himawari = require('@ungoldman/himawari')
const mkdirp = require('mkdirp')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

const INTERVAL = 10 // Time interval (in minutes)
const OUTDIR = path.resolve('images') // image output directory
const CONCURRENCY = 10
const ZOOM = 1

// string coercion shortcut
function str (x) { return '' + x }
function pad (x) {
  let y = str(x)
  while (y.length < 2) y = '0' + y
  return y
}

// Create a list of dates from `start` to `end` at a frequency of `interval` minutes
function run (opts, callback) {
  const NOW = new Date()
  const YESTERDAY = new Date(moment().subtract(1, 'days').format())

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

  const diffMs = opts.end - opts.start
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const intervals = Math.floor(diffMinutes / opts.interval)
  let minutes = 0

  // set up worker queue
  const dates = async.queue(function (date, queueCallback) {
    const filename = date.getTime()

    const outfile = path.join(opts.outdir,
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

  for (let i = 0; i <= intervals; i++) {
    const date = new Date(opts.start)
    date.setMinutes(minutes)
    dates.push(date)
    minutes += opts.interval
  }
}

module.exports = run
