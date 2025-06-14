const { uploadToCloudinary, deleteFromCloudinary } = require('./cloudinaryUploader');

module.exports = {
  uploadImage: uploadToCloudinary,
  deleteImage: deleteFromCloudinary
};
