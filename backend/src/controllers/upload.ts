import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { fileTypeFromBuffer } from "file-type";
import fs from "fs/promises";
import * as process from "node:process";
import BadRequestError from '../errors/bad-request-error'

const isAllowedFiles = (filetype: string | undefined) => {
    const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp'
    ]

    return filetype ? allowedTypes.includes(filetype) : false;
}

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        const file = await fs.readFile(`${req.file.path}`);

        const fileType = await fileTypeFromBuffer(file);
        if (!isAllowedFiles(fileType?.mime)) {
            return next(new BadRequestError("Unsupported file type"));
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}
