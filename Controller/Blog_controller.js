const fs = require("fs");
const path = require("path");

const BlogModel = require("../Model/Blog_model.js");

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(`Failed to delete old image: ${err.message}`);
    }
  });
};

// CREATE BLOG
const createBlog = async (req, res) => {
  try {
    const { title, content, author, metaKeywords, metaDescription } = req.body;

    // Retrieve filenames from `req.files`
    const blogImage = req.files.image ? req.files.image[0].filename : null;
    const blogThumbnail = req.files.thumbnail
      ? req.files.thumbnail[0].filename
      : null;

    const result = await BlogModel.createBlog(
      title,
      content,
      blogImage,
      blogThumbnail,
      author,
      metaKeywords,
      metaDescription
    );

    return res
      .status(201)
      .json({ status: true, message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getAllBlogs();
    // console.log(blogs);

    if (blogs.length > 0) {
      return res.status(200).json({ status: true, blogs });
    } else {
      return res.status(404).json({ status: false, message: "No blogs found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// GET BLOG BY ID
const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await BlogModel.getBlogById(id);

    console.log(req.params);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res.status(200).json({ status: true, blog });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// UPDATE BLOG

const updateBlog = async (req, res) => {
  try {
    const { id, title, body, author, metaKeywords, metaDescription } = req.body;
    
    // Check for uploaded files for `blog_image` and `thumbnail`
    const newBlogImage = req.files?.image ? req.files.image[0].filename : req.body.blog_image;
    const newThumbnail = req.files?.thumbnail ? req.files.thumbnail[0].filename : req.body.thumbnail;

    const blog = await BlogModel.getBlogById(id);
    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    // Delete old `blog_image` if a new one is uploaded
    if (req.files?.image && blog[0].blog_image) {
      const oldBlogImagePath = path.join(__dirname, "../Assets/blog_images", blog[0].blog_image);
      deleteOldImage(oldBlogImagePath);
    }

    // Delete old `thumbnail` if a new one is uploaded
    if (req.files?.thumbnail && blog[0].thumbnail) {
      const oldThumbnailPath = path.join(__dirname, "../Assets/blog_images", blog[0].thumbnail);
      deleteOldImage(oldThumbnailPath);
    }

    // Update the blog entry in the database
    const result = await BlogModel.updateBlog(
      id,
      title,
      body || blog[0].blog_body,
      newBlogImage || blog[0].blog_image,
      newThumbnail || blog[0].thumbnail,
      author,
      metaKeywords,
      metaDescription
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res.status(200).json({ status: true, message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Internal server error", error });
  }
};


// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await BlogModel.getBlogById(id);

    if (blog.length === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    if (blog[0].blog_image) {
      const imagePath = path.join(
        __dirname,
        "../blog_images/",
        blog[0].blog_image
      );
      deleteOldImage(imagePath);
    }

    const result = await BlogModel.deleteBlog(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Blog deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};

// LATEST BLOGS
const latestBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.getLatestBlog();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ status: false, message: "No blogs found" });
    }

    return res.status(200).json({ status: true, blogs });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", error });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  latestBlogs,
};
