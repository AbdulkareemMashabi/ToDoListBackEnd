const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    calendarId: {
      type: String,
    },
    color: {
      type: String,
    },
    subTasks: [
      {
        title: {
          type: String,
        },
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
