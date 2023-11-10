"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (http, api, ctx) {
  function handleUpload(image) {
    var cb;
    var nextURL = 'https://www.facebook.com/profile/picture/upload/';
    var returnPromise = new Promise(function (resolve, reject) {
      cb = function (error, data) {
        data ? resolve(data) : reject(error);
      }
    });

    if (!utils.isReadableStream(image)) 
      cb('Image is not a readable stream');

    http
      .postFormData(nextURL, ctx.jar, {
        profile_id: ctx.userID,
        photo_source: 57,
        av: ctx.userID,
        file: image
      })
      .then(utils.parseAndCheckLogin(ctx, http))
      .then(function (res) {
        if (res.error) 
          throw res;
        return cb(null, res);
      })
      .catch(cb);

    return returnPromise;
  }

  return function changeAvatar(image, caption = "", timestamp = null, callback) {
    var cb;
    var returnPromise = new Promise(function (resolve, reject) {
      cb = function (error, data) {
        data ? resolve(data) : reject(error);
      }
    });

    if (typeof caption == 'number') {
      timestamp = caption;
      caption = '';
    }
    if (typeof caption == 'function') {
      callback = caption;
      caption = '';
    }
    if (typeof timestamp == 'function') {
      callback = timestamp;
      timestamp = null;
    }
    if (typeof callback == 'function') cb = callback;

    handleUpload(image)
      .then(function (res) {
        var form = {
          fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
          doc_id: "5066134240065849",
          variables: JSON.stringify({
            input: {
              caption,
              existing_photo_id: res.payload.fbid,
              expiration_time: timestamp,
              profile_id: ctx.userID,
              profile_pic_method: "EXISTING",
              profile_pic_source: "TIMELINE",
              scaled_crop_rect: {
                height: 1,
                width: 1,
                x: 0,
                y: 0
              },
              skip_cropping: true,
              actor_id: ctx.userID,
              client_mutation_id: Math.round(Math.random() * 19).toString()
            },
            isPage: false,
            isProfile: true,
            scale: 3
          }),
          fb_api_caller_class: "RelayModern"
        }
        return http
          .post('https://www.facebook.com/api/graphql', ctx.jar, form)
          .then(utils.parseAndCheckLogin(ctx, http));
      })
      .then(function (res) {
        if (res.errors) 
          throw res;
        return cb(null, (res[0] || res).data.profile_picture_set.profile);
      })
      .catch(function (err) {
        log.error('changeAvaV2', err);
        return cb(err);
      });

    return returnPromise;
  }
}