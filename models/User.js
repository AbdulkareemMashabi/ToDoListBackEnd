const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: function () {
        return !this.deviceId; // Makes email required if deviceId is missing
      },
    },
    password: {
      type: String,
      required: function () {
        return !this.deviceId; // Makes email required if deviceId is missing
      },
    },
    deviceId: {
      type: String,
      required: function () {
        return !this.email; // Makes email required if deviceId is missing
      },
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
