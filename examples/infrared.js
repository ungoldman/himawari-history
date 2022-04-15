const hh = require('../')
const moment = require('moment')

const start = new Date(moment().subtract(7, 'days').format())

hh({
  start: start,
  infrared: true,
  zoom: 2,
  parallel: true,
  debug: true,
  onFileSuccess: function (outfile) {
    console.log(`✅  ${outfile}`)
  }
}, function () {
  console.log('✅  all done')
})
