"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
console.log('expiry time is :', config_1.configuration.jwt_token.expiretime);
console.log("--------------------------------------", config_1.configuration.jwt_token.expiretime);
const secretKey = config_1.configuration.jwt_token.secretkey;
function generateToken(user) {
    return jsonwebtoken_1.default.sign(user, secretKey, { expiresIn: (config_1.configuration.jwt_token.expiretime) }); // time is 1 day represented in millisecond
}
