"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    user_created(req, res, next) {
        res.send({
            message: "user created successfully",
        });
    },
    success_signin(data, req, res, next) {
        res.send({
            message: "success",
            data: data.user,
            tokens: {
                refresh_token: data.refresh_token,
                auth_token: data.auth_token,
            },
        });
    },
    username_or_password_is_incorrect(req, res, next) {
        res.statusCode = 401;
        res.send({
            message: "username or password is incorrect",
        });
    },
    error(req, res, next) {
        res.statusCode = 500;
        res.send({
            message: "an error occurred on the server side",
        });
    },
    username_already_registered(req, res, next) {
        res.statusCode = 409;
        res.send({
            message: "username already registered",
        });
    },
    invalid_token(req, res, next) {
        res.statusCode = 401;
        res.send({
            message: "Invalid token",
        });
    },
    auth_token_changed(data, req, res, next) {
        res.statusCode = 200;
        res.send({
            message: "auth token changed",
            auth_token: data.auth_token,
        });
    },
    profile_photo_uploaded(data, req, res, next) {
        res.statusCode = 200;
        res.send({
            message: "profile photo uploaded",
            profile_photo_filename: data.profile_photo_filename,
        });
    },
    channel_created(data, req, res, next) {
        res.statusCode = 201;
        res.send(Object.assign(data, {
            message: "channel created",
        }));
    },
    group_created(data, req, res, next) {
        res.statusCode = 201;
        res.send(Object.assign(data, {
            message: "group created",
        }));
    },
    username_is_not_unique(req, res, next) {
        res.statusCode = 409;
        res.send({
            message: "another chat exists with this username",
        });
    },
    file_not_valid(req, res, next) {
        res.statusCode = 400;
        res.send({
            message: "file type is not valid",
        });
    },
    cannot_remove_profile_photo(req, res, next) {
        res.statusCode = 503;
        res.send({
            message: "this profile_photo isn't yours",
        });
    },
    profile_photo_removed(req, res, next) {
        res.statusCode = 200;
        res.send({
            message: "profile_photo removed",
        });
    },
};
