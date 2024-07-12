"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function deleteFile(filePath) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting file:", err);
        }
        else {
            console.log("File deleted:", filePath);
        }
    });
}
module.exports = deleteFile;
