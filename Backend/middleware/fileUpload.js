const multer = require('multer')
const fs = require('fs')
const path = require('path')



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dstn = 'public/uploads'
        if(!fs.existsSync(dstn)){
            fs.mkdirSync(dstn,{recursive: true})
        }
      cb(null, dstn)
    },
    filename: function (req, file, cb) {
        //example: apple.jpg
        let extname = path.extname(file.originalname)//jpg
        let basename = path.basename(file.originalname, extname)//ext name hatunalai. //apple
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const filename = basename + "-" + uniqueSuffix + extname
      cb(null, filename)
    }
  })

  const fileFilter = (req,file,next)=>{
    if(!file.originalname.match(/[.](jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF|pdf|PDF)$/)){
        return next(new Error("INVALID FILE FORMAT"),false)
    }
    next(null, true)

  }
  
  const upload = multer({ 
    storage: storage ,
    limits: {
        filesize: 200000
    },
    fileFilter: fileFilter
    
})

  module.exports = upload