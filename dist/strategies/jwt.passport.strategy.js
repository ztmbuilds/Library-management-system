"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const config_1 = require("../config");
const passport_1 = __importDefault(require("passport"));
if (!config_1.JWT_SECRET)
    throw new Error('JWT_SECRET must be defined');
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.JWT_SECRET,
}, (payload, done) => {
    user_model_1.User.findById(payload.id)
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
        .catch((err) => done(err, null));
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    user_model_1.User.findById(id)
        .then((user) => {
        done(null, user);
    })
        .catch((err) => done(err, null));
});
exports.default = passport_1.default;
