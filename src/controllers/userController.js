import multer from "multer";
import {app} from "./../config/app";
import {transErrors} from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";


let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);
    }

    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {fileSize: app.avatar_limit_size}
}).single("avatar");

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(error);
    }
    try {
      let updateUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now()
      };
      // update user
      let userUpdate = await user.updateUser(req.user._id, updateUserItem);

      // remove old user avatar
    } catch (error) {

    }
  });
}

module.exports = {
  updateAvatar: updateAvatar
};