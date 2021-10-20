import multer from "multer";
import {app} from "./../config/app";

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {

  }
});

let updateAvatar = (req, res) => {

}

module.exports = {
  updateAvatar: updateAvatar
};