var path = require('path')
var mkdirp = require('mkdirp')

var out = path.join(__dirname, 'images', 'infrared')
var video = path.join(__dirname, 'videos', 'infrared', 'history.mp4')

mkdirp.sync(out)
mkdirp.sync(path.dirname(video))

var cmd = `find ${out} -name *.jpg -print0 | xargs -0 cat | ffmpeg -f image2pipe -vcodec mjpeg -analyzeduration 100M -probesize 100M -i - -vcodec libx264 ${video}`

// Pipe all images to ffmpeg and create a video. Simple as that!
require('child_process').exec(cmd, function (err, res) {
  if (err) {
    console.error(err)
  } else {
    console.log('File saved to', video)
  }
})
