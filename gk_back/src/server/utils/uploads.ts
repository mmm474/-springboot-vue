import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 获取文件类型 将文件存储在upload目录下的对应文件夹下
    const fileType = file.mimetype.split('/')[0]
    cb(null, path.resolve(process.cwd(), `src/static/${fileType}`));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
})

export const uploads = multer({ storage: storage });