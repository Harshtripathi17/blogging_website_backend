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
const author_interface_1 = require("../db/interfaces/author.interface");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.SECRETKEY;
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["authorization"];
            console.log("-------------------USING MIDDLEWARE STARTING----------------------------------");
            console.log("authheader - ", authHeader);
            const token = authHeader && authHeader.split(" ")[1];
            console.log("\ntoken-", token);
            if (!token) {
                console.log("token does not exist");
                return res.sendStatus(401); // unauthorized
            }
            jsonwebtoken_1.default.verify(token, secretKey, (error, user) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    if (error.name === "TokenExpiredError") {
                        console.log("expiration of token");
                        return res.status(401).json({ message: "Token Expired" });
                    }
                    return res.status(401).json({ error });
                }
                // check if the user exists in the database
                const row = yield author_interface_1.Author.findOne({
                    where: {
                        id: user.id,
                    },
                });
                console.log("2:id=", user.id, "row:", row);
                if (!row) {
                    console.log("user does not exist");
                    return res.status(401).json({ message: "User does not exist" });
                }
                req.user = {
                    email: user.email,
                    id: user.id,
                };
                console.log("--------------------------MIDDLEWARE ENDED-------------------------------");
                next();
            }));
        }
        catch (error) {
            console.log("error is:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
exports.default = authenticateToken;
