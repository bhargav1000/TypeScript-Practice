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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var node_process_1 = require("node:process");
var web_1 = require("polkadot-api/ws-provider/web");
var polkadot_api_1 = require("polkadot-api");
var descriptors_1 = require("@polkadot-api/descriptors");
function makeClient(endpoint) {
    console.log("Connecting to endpoint: ".concat(endpoint));
    var provider = (0, web_1.getWsProvider)(endpoint);
    var client = (0, polkadot_api_1.createClient)(provider);
    return client;
}
function printChainInfo(client) {
    return __awaiter(this, void 0, void 0, function () {
        var chainSpec, finalizedBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getChainSpecData()];
                case 1:
                    chainSpec = _a.sent();
                    return [4 /*yield*/, client.getFinalizedBlock()];
                case 2:
                    finalizedBlock = _a.sent();
                    console.log("Connected to ".concat(chainSpec.name, " at block ").concat(finalizedBlock.number, ".\n"));
                    return [2 /*return*/];
            }
        });
    });
}
function getBalance(polkadotClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var dotApi, accountInfo, _a, free, reserved;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dotApi = polkadotClient.getTypedApi(descriptors_1.dot);
                    return [4 /*yield*/, dotApi.query.System.Account.getValue(address)];
                case 1:
                    accountInfo = _b.sent();
                    _a = accountInfo.data, free = _a.free, reserved = _a.reserved;
                    return [2 /*return*/, free + reserved];
            }
        });
    });
}
function getDisplayName(peopleClient, address) {
    return __awaiter(this, void 0, void 0, function () {
        var peopleApi, accountInfo, displayName;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    peopleApi = peopleClient.getTypedApi(descriptors_1.people);
                    return [4 /*yield*/, peopleApi.query.Identity.IdentityOf.getValue(address)];
                case 1:
                    accountInfo = _b.sent();
                    displayName = (_a = accountInfo === null || accountInfo === void 0 ? void 0 : accountInfo[0].info.display.value) === null || _a === void 0 ? void 0 : _a.asText();
                    return [2 /*return*/, displayName];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var polkadotClient, peopleClient, address, balance, display;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    polkadotClient = makeClient("wss://rpc.polkadot.io");
                    console.log({ polkadotClient: polkadotClient });
                    peopleClient = makeClient("wss://polkadot-people-rpc.polkadot.io");
                    return [4 /*yield*/, printChainInfo(peopleClient)];
                case 1:
                    _a.sent();
                    address = "15DCZocYEM2ThYCAj22QE4QENRvUNVrDtoLBVbCm5x4EQncr";
                    return [4 /*yield*/, getBalance(polkadotClient, address)];
                case 2:
                    balance = _a.sent();
                    return [4 /*yield*/, getDisplayName(peopleClient, address)];
                case 3:
                    display = _a.sent();
                    console.log("\n        Display Name: ".concat(display, "\n        Address: ").concat(address, " has Balance: ").concat(balance, "\n        "));
                    console.log("Done!");
                    node_process_1.default.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
main();
