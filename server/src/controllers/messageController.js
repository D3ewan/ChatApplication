"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allMessages = exports.sendMessages = void 0;
var mongoose_1 = require("mongoose");
var messageModel_1 = require("../models/messageModel");
var zod_1 = require("zod");
var userModel_1 = require("../models/userModel");
var chatModel_1 = require("../models/chatModel");
var BodySchema = zod_1.z.object({
    content: zod_1.z.string().max(150),
    chatId: zod_1.z.string()
});
//  POST /api/message/
var sendMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, content, chatId, modifiedChatId, id, mssg, val, data, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = BodySchema.parse(req.body), content = _a.content, chatId = _a.chatId;
                modifiedChatId = JSON.parse(chatId);
                id = req._id;
                return [4 /*yield*/, messageModel_1.default.create({
                        sender: new mongoose_1.default.Types.ObjectId(req._id),
                        content: content,
                        chat: modifiedChatId
                    })];
            case 1:
                mssg = _b.sent();
                return [4 /*yield*/, mssg.populate('sender')];
            case 2:
                val = _b.sent();
                return [4 /*yield*/, mssg.populate('chat')];
            case 3:
                data = _b.sent();
                return [4 /*yield*/, userModel_1.default.populate(data, {
                        path: 'chat.users',
                        select: 'name pic email',
                    })];
            case 4:
                data = _b.sent();
                return [4 /*yield*/, chatModel_1.default.findByIdAndUpdate(modifiedChatId, { latestMessage: data })];
            case 5:
                _b.sent();
                return [2 /*return*/, res.json(data)];
            case 6:
                error_1 = _b.sent();
                // console.log(error);
                // console.log((error as Error).message);
                return [2 /*return*/, res.status(400).send(error_1.message)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendMessages = sendMessages;
//   GET /api/message/:chatId
var allMessages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, messageModel_1.default.find({ chat: req.params.chatId })
                        .populate("sender", "name pic email")
                        .populate("chat")];
            case 1:
                messages = _a.sent();
                res.json(messages);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                // console.log(error)
                return [2 /*return*/, res.status(400).send(error_2.message)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.allMessages = allMessages;