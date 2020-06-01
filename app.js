const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

//Set Storage engine
const storageEngine = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, callBack){
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
//Initialize Upload Method => used in POST route
const upload = multer({
    storage: storageEngine,
    limits: {fileSize: 10000000},     //maximum image size in bytes
    fileFilter: function(req, file, callBack){
        checkFileType(file, callBack)
    }
}).single('myImage')    //one file (name of input in form)

function checkFileType(file, callBack){
    const allowedFileTypes = /jpeg|jpg|png|gif/;    //Regex
    const hasAllowedExtname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
    const hasAllowedMimetype = allowedFileTypes.test(file.mimetype)

    if(hasAllowedExtname && hasAllowedMimetype){
        callBack(null, true)    //no error and true
    } else{
        callBack('Error: Images Only!') //send error
    }
}

const app = express()

//EJS
app.set('view engine', 'ejs')

//Public folder
app.use(express.static('./public'))

//GET
app.get('/', (req, res)=> res.render('index'))

//POST (image)
app.post('/upload', (req, res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.render('index',{
                msg: err
            })
        } else{
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error! No File Selected!'
                })
            } else{
                res.render('index',{
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`    //used to display image
                })
            }
        }
    })
})

const port = 7000

app.listen(port, ()=> console.log(`server running on port ${port}`))