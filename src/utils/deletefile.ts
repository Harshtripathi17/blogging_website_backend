/** @format */

import express from "express";
const fs = require("fs");
const path = require("path");

function deleteFile(filePath: string) {
  fs.unlink(filePath, (err: any) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted:", filePath);
    }
  });
}

module.exports = deleteFile;
