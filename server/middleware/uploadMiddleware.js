import multer from "multer";

//const storage = multer.diskStorage();

const upload = multer({storage: multer.diskStorage({})})

export default upload;