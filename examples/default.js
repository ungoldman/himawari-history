var hh = require('../')

hh({
  debug: true,
  onFileSuccess: function (outfile) {
    console.log(`✅  ${outfile}`)
  }
}, function () {
  console.log('✅  all done')
})
