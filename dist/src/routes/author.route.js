"use strict";
/** @format */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const authorRoute = express_1.default.Router();
// ! -------------IMAGE UPLOAD-------------------
const storage = multer_1.default.diskStorage({
    destination: "./uploadedImages",
    filename: (req, image, callback) => {
        console.log("===========uploading image==============");
        const uniqueName = image.originalname.split(".")[0] +
            "_" +
            Date.now() +
            path_1.default.extname(image.originalname);
        console.log("name of image uploaded in folder (multer):", uniqueName);
        return callback(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        // 1 means 1 bit, 1000 =1000bit or 1 byte , 1000000 bit =1000byte or 1 mb , 10 = 10 bit
        fileSize: 10000000,
    },
});
authorRoute.use("/image", express_1.default.static("uploadedImages/"));
// ! -------------------------------------------------
// !-------------------REGISTER-----------------------
authorRoute.post("register", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        console.log;
    }
}));
exports.default = authorRoute;
