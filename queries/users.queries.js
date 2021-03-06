const User = require('../database/models/user.model');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (user) => {
  try{
    const hashedPassword = await User.hashedPassword(user.password);
    const newUser = new User({
      username: user.username,
      local: {
        email: user.email,
        password: hashedPassword,
        emailToken: uuidv4()
      }
    })
    return newUser.save();
  }catch(e){
    throw e;
  }
}

exports.findUserPerEmail = (email) => {
  return User.findOne({ 'local.email': email }).exec();
}

exports.findUserPerId = (id) => {
  return User.findById(id).exec();
}

exports.getUserPerUsername = (username) => {
  return User.findOne({ username }).exec();
}

exports.searchUsersPerUsername = (search) => {
  const regExp = `^${ search }`;
  const reg = new RegExp(regExp);
  return User.find({ username: {$regex: reg } }).exec();
}

exports.addUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = [ ...currentUser.following, userId ];
  return currentUser.save();
}

exports.removeUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = currentUser.following.filter( objId => objId.toString() !== userId );
  return currentUser.save();
}
