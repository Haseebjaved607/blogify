import { Router } from 'express';
import multer from 'multer';
import path from "path";
import Blog from '../model/blog.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads/'));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    return res.render('addblog', {
        user: req.user
    });
});

router.post('/', upload.single("coverimage"), async (req, res) => {
    try {
        const { title, body } = req.body;
        const blog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageUrl: `/uploads/${req.file.filename}`
        });
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
});

export default router;
