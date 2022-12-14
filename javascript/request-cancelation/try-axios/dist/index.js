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
const controller = new AbortController();
const { signal } = controller;
function beginFetch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('fetching');
        const url = 'https://httpbin.org/delay/3';
        try {
            const res = yield fetch(url, {
                method: 'get',
                signal,
            });
            console.log('fetch completed (not aborted): ', res);
        }
        catch (e) {
            console.error('Error: ', e);
        }
    });
}
function abortFetch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('aborting fetch');
        controller.abort();
    });
}
