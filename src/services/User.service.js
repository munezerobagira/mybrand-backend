import { cloudinaryFolders } from "../config";
import { cloudinaryUploader } from "../helpers/uploader";
import { User } from "../models";

export default class UserService {
  static async signup({ name, username, email, password }) {
    const user = new User({
      name,
      username,
      email,
      password,
      role: "guest",
    });
    await user.save();
    return {
      success: true,
      user: Object.assign(user._doc, {
        password: undefined,
        tokens: undefined,
      }),
    };
  }

  static async updateUser(
    id,
    {
      name = null,
      username = null,
      keywords = null,
      summary = null,
      info = null,
      profilePic,
      token = null,
      star = null,
      password = null,
      about = null,
    }
  ) {
    const user = await User.findOne({ _id: id });
    if (!user)
      return {
        success: false,
        error: "User not found, you might need to login",
      };
    if (name) user.name = name;
    if (username) user.username = username;
    if (keywords) user.keywords = keywords;
    if (summary) user.summary = summary;
    if (password) user.password = password;
    if (info) user.info = info;
    if (about) user.about = about;
    if (profilePic) {
      const uploadResult = await cloudinaryUploader(
        profilePic,
        cloudinaryFolders.profiles
      );
      user.profilePic = {
        path: uploadResult.secure_url || uploadResult.url,
        width: uploadResult.width,
        height: uploadResult.height,
      };
    }
    if (token && token.action === "add") user.tokens.push(token.value);
    else if (token && token.action === "remove") user.tokens.pull(token.value);
    if (star) user.star = star;
    await user.save();
    return {
      success: true,
      user: Object.assign(user._doc, {
        password: undefined,
        tokens: undefined,
      }),
    };
  }

  static async deleteUser(id) {
    const user = await User.findOneAndDelete({ _id: id });
    if (!user)
      return {
        success: false,
        error: "User not found or you might need to login",
      };
    return { success: true, user };
  }

  static async getUser(filter) {
    const userData = await User.findOne(filter);
    if (!userData)
      return {
        success: false,
        error: "User not found or you might need to login",
      };
    const user = { ...userData._doc, password: undefined, tokens: undefined };
    return { success: true, user };
  }

  static async getUsers({ skip = 0, count = 100, filter = {} }) {
    const users = await User.find(filter)
      .limit(count)
      .skip(skip * count);
    if (!users) return { success: false, error: "Users not found" };
    return { success: true, users };
  }

  static async verifyProfile(id) {
    const user = await User.findOne({ _id: id });
    user.verified = true;
    await user.save();
    return {
      success: true,
      user: Object.assign(user._doc, {
        password: undefined,
        tokens: undefined,
      }),
    };
  }
}

