import { CancelStatus } from "@/contracts/cancle-status";
import mongoose, { Document, model, Schema } from "mongoose";

export interface MergeTransactionDocument {
  _id?: mongoose.Types.ObjectId;
  amount: number;
  balance: number;
  cancelYn: CancelStatus;
  date: Date;
  storeId: string;
  transactionId: string;
  productId: string;
}

export const mergeTransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  cancelYn: { type: String, required: true, enum: ["Y", "N"] },
  date: { type: Date, required: true },
  storeId: { type: String, required: true },
  productId: { type: String, required: true },
});

export const mergeTransactionDataModel = model<
  MergeTransactionDocument & Document
>("MergeTransaction", mergeTransactionSchema, "merge_transactions");
