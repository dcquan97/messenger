import {contact} from "./../services/index";

let findUserContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.findUserContact(currentUserId, keyword);

  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  findUserContact: findUserContact
}