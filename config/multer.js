const multer = require('multer');
const path = require('path');
const fs = require('fs');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|bmp|webp/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Images Only!'));
    }
};

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 10000000 } // 10MB limit
}).single('image');

const validateFileExists = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                reject(new Error('File not found'));
            } else {
                resolve();
            }
        });
    });
};

exports.upload = (req, res) => {
    uploadImage(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ status: 400, message: "Upload image failed!", error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ status: 400, message: "No file provided!" });
        }
        return res.status(200).json({ status: 200, message: "Upload image success!", filename: req.file.filename });
    });
};

exports.update = async (req, res) => {
    const oldImageName = req.params.name;
    const oldImagePath = path.join(__dirname, '../public/images', oldImageName);

    try {
        await validateFileExists(oldImagePath);
    } catch (err) {
        return res.status(404).json({ status: 404, message: "Old image not found!" });
    }

    uploadImage(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ status: 400, message: "Update image failed!", error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ status: 400, message: "No file provided!" });
        }
        fs.unlink(oldImagePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ status: 500, message: "Failed to delete old image!" });
            }
            return res.status(200).json({ status: 200, message: "Update image success!", filename: req.file.filename });
        });
    });
};

exports.delete = async (req, res) => {
    const imageName = req.params.name;
    const imagePath = path.join(__dirname, '../public/images', imageName);
    console.log(imagePath);

    try {
        await validateFileExists(imagePath);
    } catch (err) {
        return res.status(404).json({ status: 404, message: "Image not found!" });
    }

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 500, message: "Delete image failed!" });
        }
        return res.status(200).json({ status: 200, message: "Delete image success!" });
    });
};

exports.display = async (req, res) => {
    const imageName = req.params.name;
    const imagePath = path.join(__dirname, '../public/images', imageName);

    try {
        await validateFileExists(imagePath);
    } catch (err) {
        return res.status(404).json({ status: 404, message: "Image not found!" });
    }

    res.sendFile(imageName, { root: 'public/images' });
};
