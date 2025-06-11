import mongoose from "mongoose";

export const isMongoIdValid = (id) => {
 if (!mongoose.Types.ObjectId.isValid(id)) {
   throw new Error('Invalid product ID format');
 }
}