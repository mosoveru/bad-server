import { Router } from 'express'
import multer from "multer";
import path from "path";
import { fakerEN } from '@faker-js/faker';
import * as process from "node:process";
import { uploadFile } from '../controllers/upload'
import BadRequestError from "../errors/bad-request-error";

const storage = multer.diskStorage({
    destination: `${path.join(__dirname, '..', 'public/', process.env.UPLOAD_PATH ? process.env.UPLOAD_PATH : 'images')}`,
    filename: (_, file, cb) => {
        cb(null, fakerEN.string.uuid() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 },
    fileFilter: async (req, _, cb) => {
        if (Number(req.headers["content-length"]) < 2048) {
            cb(new BadRequestError('Image size must be greater than 2Kb'));
        }
        
        else cb(null, true);
    }
});

const uploadRouter = Router()
uploadRouter.post('/', upload.single('file'), uploadFile)

export default uploadRouter
