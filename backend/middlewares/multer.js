import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log('multer destination req.headers:', req.headers)
        console.log('multer destination file:', file && typeof file === 'object' ? Object.keys(file) : file)
        callback(null, uploadsDir)
    },
    filename: function (req, file, callback) {
        console.log('multer filename file:', file)
        const original = file && file.originalname ? file.originalname : 'unknown'
        const safeName = Date.now() + '-' + original
        callback(null, safeName)
    }
})

const upload = multer({ storage })

export default upload