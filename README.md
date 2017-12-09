# express-static-server
Using Express.js as static file server

---


Let’s say we are in a situation where we don’t want our back-end service to be busy with static file requests. In Ynot Partners software development company that I co-founded, we had lots of situations like this. So we came up with a solution:
```
Separate containers for back-end service and static file server.
```

---

## 1. Serving files

* First, install following packages 
```
$ npm install path
$ npm install express
$ npm install require
```
* Then create a directory named media, which contains static files. ( I want to use the name 'media' to avoid confusion. )
* Inside that directory, create a simple text file called helloWorld.txt

```
$ mkdir media
$ cd media/
$ echo 'Hello World' > helloWorld.txt
```
* Create a server file
```
// server.js

const path = require( 'path' );
const express = require( 'express' );

const app = express();

// tell express to use '/media' path as static route
app.use('/media',
  express.static( path.resolve( __dirname, './media' ) )
);

app.listen(3000, 'localhost', ( err ) => {
  if ( err ) console.error( err );
  else console.info( 'Listening at http://localhost:3000' );
});
```
* Run server.js 
```
$ node server.js
```
#### It’s done, you are serving files inside media dir through express
Go to http://localhost:3000/media/helloWorld.txt


---

## 2. Uploading files

* I like using multer package as storage handler, lets install then 
```
$ npm install multer
```

* Configure multer storage
```
// server.js

const multer = require( 'multer' );

const storage = multer.diskStorage({
  destination: ( req, file, callback ) => 
    callback( null, './media'),
  filename: ( req, file, callback ) => 
    callback(null, file.fieldname + '-' + Date.now() + path.extname( file.originalname )
});

const upload = multer( { storage } );
```
To prevent duplication, added `-${timestamp}`to the end of filename.

* Add POST request handler to express app
```
// server.js

app.post( '/file', upload.single( 'file' ), ( req, res ) => {
  if ( req.file ) {
    res.json( { path: '/' + req.file.path } )
  } else {
    res.json( { success: false } )
  }
})
```

* Create a function sends POST request to express server
```
// uploadFile.js

const uploadFile = ( file, filename = null ) => {
  const baseUrl = 'http://localhost:3000';
  let formData = new FormData();

  formData.append( "file", file );

  // fetch POST request to express server
  return fetch( baseUrl + '/file', {
    method: 'POST',
    body: formData
  } )
    .then( response => response.json()
      .then( json => ( { json, response } ) )
    )
    .then(({ json, response }) => 
      !response.ok ? Promise.reject(json) : json      
    )
    .then(
      response => response,
      error => error
    )
}
```
#### Almost there, time to implement in html

* Create an index.html to put it all together
```
// index.html

<input name="file" id="file" type="file"/>
<button style="display: none;" id="button">Upload</button>

<script src="uploadFile.js"></script>
<script>
  let uploadButton = document.getElementById('button');
  let inputElement = document.getElementById('file');

  // init Listeners
  inputElement.onchange = event => {
    const file = inputElement.files[0];
    uploadButton.addEventListener('click', event => uploadFile(file));

    // display button when user selects file
    uploadButton.style.display = 'inline';
  }
</script>
```
#### Open your index.html and start uploading!
