import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, default: "" },   // not required
  image: { type: String, default: "" },  // optional
  seen: { type: Boolean, default: false }
}, { timestamps: true });

// Validation: At least text or image must exist
messageSchema.pre("save", function(next) {
  if (!this.text && !this.image) {
    return next(new Error("Message must contain text or image"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
