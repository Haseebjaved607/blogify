import { Router } from 'express';
import multer from 'multer';
import path from "path";
import Blog from '../model/blog.js';
import Comment from '../model/comment.js';
import { checkForAuthenticationCookie } from '../middlewares/auth.js';


const router = Router();

router.use(checkForAuthenticationCookie('authToken'));

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

// import Comment from '../model/comment.js'; // Make sure to import the Comment model

router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("createdBy");
        const comments = await Comment.find({ blogId: blog._id }).populate("createdBy");

        return res.render("blogDetail", {
            user: req.user,
            blog,
            comments // Pass the comments to the template
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Server Error');
    }
});

  
router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
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
