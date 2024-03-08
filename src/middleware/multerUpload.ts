import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const handleFileUpload = async(req: Request, res: Response, next: NextFunction) =>{
    upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ data:[], message:"Server error", error: err.message });
        }

        if (!req.file && !req.body.image) {
          return res.status(400).send({ data: req.body, message: "No Image provided!!", error: "Upload failed" });
        }
        
        req.body.image = req.file || req.body.image;
        next();
      });
}
