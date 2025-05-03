"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleError = consoleError;
exports.consoleWarn = consoleWarn;
exports.consoleLog = consoleLog;
function consoleError(...error) {
    for (let index = 0; index < error.length; index++) {
        console.error("❌❌❌", error, "❌❌❌");
    }
}
function consoleWarn(...warning) {
    for (let index = 0; index < warning.length; index++) {
        console.warn("❕❕❕", warning, "❕❕❕");
    }
}
function consoleLog(...log) {
    for (let index = 0; index < log.length; index++) {
        console.log("👉👉👉", log[index], "👈👈👈");
    }
}
//# sourceMappingURL=logFunctions.js.map