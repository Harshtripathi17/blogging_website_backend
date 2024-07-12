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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRET_KEY;
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return res.sendStatus(401); // Unauthorized
            }
            jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({ message: "Token Expired" });
                    }
                    return res.status(401).json({ message: "Unauthorized" });
                }
                req.user = {
                    email: user.email,
                    id: user.id,
                };
                next();
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.default = authenticateToken;
