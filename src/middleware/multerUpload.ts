import multer from "multer";
import { Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const handleFileUpload = async(req: Request, res: Response, next: NextFunction) =>{
    upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(500).send({ error: err.message });
        }

        if (!req.file) {
          return res.status(400).send("Image not provided");
        }
        
        req.body.image = req.file
        next();
      });
}
