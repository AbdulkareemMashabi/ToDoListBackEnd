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
    subTasks: [
      {
        title: {
          type: String,
          required: true,
        },
        status: {
          type: Boolean,
          default: false,
        },
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
