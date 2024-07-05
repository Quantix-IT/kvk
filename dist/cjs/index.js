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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KVK = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_https_1 = __importDefault(require("node:https"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = 'https://api.kvk.nl/api';
const CERTIFICATE_PATH = '../../certs/Private_G1_chain.pem';
class KVK {
    constructor(apiKey, baseUrl, certificate, httpsAgent) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl || BASE_URL;
        this.certificate = certificate || this.getCertificate();
        this.httpsAgent = httpsAgent || this.createHttpsAgent();
    }
    getCertificate() {
        const pathToCertificate = node_path_1.default.join(__dirname, CERTIFICATE_PATH);
        const certificate = node_fs_1.default.readFileSync(pathToCertificate, {
            encoding: 'utf-8',
        });
        return certificate;
    }
    createHttpsAgent() {
        const httpsAgent = new node_https_1.default.Agent({
            ca: this.certificate,
            secureOptions: node_crypto_1.default.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
        });
        return httpsAgent;
    }
    static validateKvkNummer(val) {
        if (val.length !== 8)
            return false;
        return /^\d+$/.test(val);
    }
    static validateVestigingsnummer(val) {
        if (val.length !== 12)
            return false;
        return /^\d+$/.test(val);
    }
    request({ endpoint, params = {}, headers = {}, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = new URLSearchParams(Object.assign({}, Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)))).toString();
            const url = this.baseUrl + endpoint + (query ? `?${query}` : '');
            const res = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: Object.assign({ Accept: 'application/json', apiKey: this.apiKey }, headers),
                agent: this.httpsAgent,
            });
            const data = yield res.json();
            return data;
        });
    }
    /**
   * @deprecated This function is deprecated and will be removed in a future version.
   * The KVK api will stop supporting searching on the V1 endpoint starting 29-07-2024
   * Use [zoekenV2] instead.
   */
    zoeken(_a) {
        var { kvkNummer, vestigingsnummer, postcode, huisnummer, pagina = 1, aantal = 15 } = _a, params = __rest(_a, ["kvkNummer", "vestigingsnummer", "postcode", "huisnummer", "pagina", "aantal"]);
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
                throw new Error('KVK: Ongeldig vestigingsnummer.');
            if ((postcode && !huisnummer) || (huisnummer && !postcode))
                throw new Error('KVK: Postcode en huisnummer mogen alleen in combinatie met elkaar gebruikt worden.');
            if (pagina < 1 || pagina > 1000)
                throw new Error('KVK: Pagina is minimaal 1 en maximaal 1000.');
            if (aantal < 1 || aantal > 100)
                throw new Error('KVK: Aantal is minimaal 1 en maximaal 100.');
            return yield this.request({
                endpoint: '/v1/zoeken',
                params: Object.assign({ kvkNummer,
                    vestigingsnummer,
                    postcode,
                    huisnummer,
                    pagina,
                    aantal }, params),
            });
        });
    }
    zoekenV2(_a) {
        var { kvkNummer, vestigingsnummer, postcode, huisnummer, pagina = 1, resultatenPerPagina = 15 } = _a, params = __rest(_a, ["kvkNummer", "vestigingsnummer", "postcode", "huisnummer", "pagina", "resultatenPerPagina"]);
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
                throw new Error('KVK: Ongeldig vestigingsnummer.');
            if ((postcode && !huisnummer) || (huisnummer && !postcode))
                throw new Error('KVK: Postcode en huisnummer mogen alleen in combinatie met elkaar gebruikt worden.');
            if (pagina < 1 || pagina > 1000)
                throw new Error('KVK: Pagina is minimaal 1 en maximaal 1000.');
            if (resultatenPerPagina < 1 || resultatenPerPagina > 100)
                throw new Error('KVK: Aantal is minimaal 1 en maximaal 100.');
            return yield this.request({
                endpoint: '/v2/zoeken',
                params: Object.assign({ kvkNummer,
                    vestigingsnummer,
                    postcode,
                    huisnummer,
                    pagina,
                    resultatenPerPagina }, params),
            });
        });
    }
    basisprofiel(kvkNummer, geoData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            return yield this.request({
                endpoint: `/v1/basisprofielen/${kvkNummer}`,
                params: {
                    geoData,
                },
            });
        });
    }
    basisprofielEigenaar(kvkNummer, geoData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            return yield this.request({
                endpoint: `/v1/basisprofielen/${kvkNummer}/eigenaar`,
                params: {
                    geoData,
                },
            });
        });
    }
    basisprofielHoofdvestiging(kvkNummer, geoData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            return yield this.request({
                endpoint: `/v1/basisprofielen/${kvkNummer}/hoofdvestiging`,
                params: {
                    geoData,
                },
            });
        });
    }
    basisprofielVestigingen(kvkNummer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            return yield this.request({
                endpoint: `/v1/basisprofielen/${kvkNummer}/vestigingen`,
            });
        });
    }
    vestigingsprofiel(vestigingsnummer, geoData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
                throw new Error('KVK: Ongeldig vestigingsnummer.');
            return yield this.request({
                endpoint: `/v1/vestigingsprofielen/${vestigingsnummer}`,
                params: {
                    geoData,
                },
            });
        });
    }
    naamgeving(kvkNummer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
                throw new Error('KVK: Ongeldig kvknummer.');
            return yield this.request({
                endpoint: `/v1/naamgevingen/kvkNummer/${kvkNummer}`,
            });
        });
    }
}
exports.KVK = KVK;
exports.default = KVK;
