const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },

    profilePicture: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
    },

    bio: {
      type: String,
      default: "",
    },

    subjects: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },
    availability: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      },
    ],

    location: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
