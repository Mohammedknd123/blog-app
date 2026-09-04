const cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CODE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Upload Image 
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto'
        })
        return data
    } catch (error) {
        console.log(error);
        throw new Error('Internal Server Error (cloudinary)')
    }
}

// Cloudinary Remove Image 
const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        const resault = await cloudinary.uploader.destroy(imagePublicId);
        return resault
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary)");
    }
}

// Cloudinary Remove Multiple Image 
const cloudinaryRemoveMultipleImages = async (publiIds) => {
    try {
        const resault = await cloudinary.v2.api.delete_resources(publiIds);
        return resault
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary)");
    }
}

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImages,
};