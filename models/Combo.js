const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
comboSchema.methods.populateServices = async function () {
  await this.populate("services");
  return this;
};
const Combo = mongoose.model("Combo", comboSchema);
module.exports = Combo;
