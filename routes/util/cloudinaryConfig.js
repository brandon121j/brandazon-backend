// const dotenv = require('dotenv');
// const cloudinary = require('cloudinary').v2;

// dotenv.config();

// cloudinary.config({
// 	cloud_name: process.env.cloud_name,
// 	api_key: process.env.api_key,
// 	api_secret: process.env.api_secret,
// });

// async function singleImageUpload(filepath) {
//     console.log(filepath)
// 	return cloudinary.uploader
//     .upload(filepath, { folder: 'brandazon' })
//     .then(() => console.log("Image uploaded successfully!"))
//     .catch((err) => console.log(err))
// }

// async function multipleImageUpload(filepaths) {
//     return cloudinary.uploader
//     .upload(filepaths, { folder: 'brandazon' })
//     .then(() => console.log("Image uploaded successfully!"))
//     .catch((err) => console.log(err))
// }

// module.exports = {
//     singleImageUpload,
//     multipleImageUpload
// }