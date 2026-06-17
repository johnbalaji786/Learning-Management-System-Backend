const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload folders
const createUploadsDir = () => {

    const uploadDirs = [
        'uploads',
        'uploads/profiles',
        'uploads/recordings',
        'uploads/thumbnails'
    ];

    uploadDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

};

createUploadsDir();

// Storage Configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let uploadPath = 'uploads/';

        if (file.fieldname === 'profilePicture') {
            uploadPath += 'profiles/';
        }
        else if (file.fieldname === 'recording') {
            uploadPath += 'recordings/';
        }
        else if (file.fieldname === 'thumbnail') {
            uploadPath += 'thumbnails/';
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(
            null,
            file.fieldname +
            '-' +
            uniqueSuffix +
            path.extname(file.originalname)
        );
    }

});

// File Filter
const fileFilter = (req, file, cb) => {

    // Profile Images
    if (
        file.fieldname === 'profilePicture' ||
        file.fieldname === 'thumbnail'
    ) {

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(
                new Error('Only image files are allowed'),
                false
            );
        }
    }

    // Lesson Recordings
    else if (file.fieldname === 'recording') {

        const allowedTypes = [
            'video/mp4',
            'video/webm',
            'video/x-msvideo'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error('Only video files are allowed'),
                false
            );
        }
    }

    else {
        cb(
            new Error('Invalid upload field'),
            false
        );
    }
};

// Multer Instance
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    }

});

module.exports = upload;