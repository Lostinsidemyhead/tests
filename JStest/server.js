const http = require('http')
const fs = require('fs')
const path = require('path')


const server = http.createServer((req, res) => {
  
  let filePath = path.join(__dirname,  req.url ==='/' ? 'index.html' : req.url)
  const ext = path.extname(filePath)
  let contentType = 'text/html'

  switch (ext) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    default:
      contentType = 'text/html'
  }

  if (!ext){
    filePath += '.html'
  }
  fs.readFile(filePath, (err, data) => {
    if (err){
      res.writeHead(404)
      res.end('Error')
    } else {
      res.writeHead(200, {
        'Content-type': contentType
      })
    res.end(data)
    }
  })
})
const PORT = process.env.PORT || 3000
server.listen(PORT, () =>{
  console.log(`Server started on ${PORT}`)
})