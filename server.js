const path = require('path')
const express = require('express')
const multer = require('multer')

const app = express()

// tell express to use '/media' path as static route
app.use('/media', express.static(path.resolve(__dirname, './media')))

// assign multer storage
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, './media'),
  filename: (req, file, callback) => callback(
    null,
    file.fieldname + '-' + Date.now() + path.extname(file.originalname)
  )
})

// assign multer upload
const upload = multer({storage})

// upload file using POST request
app.post('/file', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({path: '/' + req.file.path})
  } else {
    res.json({success: false})
  }
})

// lets have flexible CORS policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

app.listen(3000, 'localhost', (err) => {
  if (err) {
    // Handle error
    console.error(err)
  } else {
    console.info('Listening at http://localhost:3000')
  }
})


