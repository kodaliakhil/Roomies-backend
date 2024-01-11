const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: false },
    phone: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        return avatar &&`${process.env.BASE_URL}${avatar}`;
      },
    },
    activated: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model("RoomiesUser", userSchema, "roomies_users");
