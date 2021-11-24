import _ from "lodash";
import ChatGroupModel from "./../models/chatGroupModel"

let addNewGroup = (currentUserId, arrayMenberIds, groupChatName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // add current userId to array members
      arrayMenberIds.unshift({userId: `${currentUserId}`});
      arrayMenberIds = _.uniqBy(arrayMenberIds, "userId");

      let newGroupItem = {
        name: groupChatName,
        userAmount: arrayMenberIds.length,
        userId: `${currentUserId}`,
        members: arrayMenberIds,
        createdAt: Date.now(),
      };

      let newGroup = await ChatGroupModel.createNew(newGroupItem);
      resolve(newGroup);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addNewGroup: addNewGroup
}