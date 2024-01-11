const UserModel = require("../models/user-model");

class UserService {
  async findUser(filter) {
    const user = await UserModel.findOne(filter);
    // console.log(user)
    return user;
  }
  async createUser(data) {
    // console.log(data)
    const user = await UserModel.create(data);
    return user;
  }
}

module.exports = new UserService();
