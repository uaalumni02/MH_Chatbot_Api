class Db {
  static async findUser(model, userName) {
    try {
      const user = await model.findOne({ userName });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async saveUser(model, user) {
    try {
      const newUser = await model({ ...user });
      return newUser.save();
    } catch (error) {
      throw error;
    }
  }
  static async getAllUsers(model) {
    try {
      const allUsers = await model.find({});
      return allUsers;
    } catch (error) {
      throw error;
    }
  }
  static async getUserById(model, id) {
    try {
      const user = await model.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }
  static async saveChatHistory(model, chat) {
    try {
      const newChat = await model({ ...chat });
      return newChat.save();
    } catch (error) {
      throw error;
    }
  }
  static async getAllChats(model) {
    try {
      const allChats = await model.find({});
      return allChats;
    } catch (error) {
      throw error;
    }
  }
  static async getChatByUserName(model, userName) {
    try {
      const getChatByUser = await model.find({ userName }).exec();
      return getChatByUser;
    } catch (error) {
      throw error;
    }
  }
  static async removeChats(model, userName) {
    try {
      const deleteChats = await model.deleteMany({ userName }); // Deletes all matching chats
      return { deletedCount: deleteChats.deletedCount }; // Return count of deleted records
    } catch (error) {
      throw error;
    }
  }
}

export default Db;
