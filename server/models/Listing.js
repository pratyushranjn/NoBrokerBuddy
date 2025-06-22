const mongoose = require("mongoose");

const defaultImageUrl = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  rent: { type: Number, required: true, min: 0 },

  images: {
    type: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    default: [{
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
      public_id: "default-no-image"
    }],
    validate: {
      validator: function (arr) {
        return arr.length <= 5;
      },
      message: 'You can upload a maximum of 5 images.'
    }
  },


  isVacant: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });



module.exports = mongoose.model("Listing", ListingSchema);

