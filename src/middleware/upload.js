import upload from "./multer.js"

const uploadSingleImage = upload.single("image")
const uploadMultipleImage = upload.array("image", 3)

export { uploadSingleImage, uploadMultipleImage }