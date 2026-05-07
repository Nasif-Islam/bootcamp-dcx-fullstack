import mongoose, { Schema, Model } from 'mongoose';

// Bike interface
export interface IBike {
   name: string,
   type: string,
   description: string,
   pricePerHour: number,
   imageUrl: string,
   createdAt?: Date, // createdAt is automatically set when a bike is first created
   updatedAt?: Date // updatedAt is automatically set on creation and updated whenever the document changes
}

// Bike schema
const bikeSchema = new Schema<IBike>(
   {
      name: {
         type: String,
         required: true,
      },
      type: {
         type: String,
         enum: ['mountain', 'road', 'city', 'electric'],
         required: true,
      },
      description: {
         type: String,
      },
      pricePerHour: {
         type: Number,
         required: true,
         min: 0,
      },
      imageUrl: {
         type: String,
      }
   },
   { timestamps: true } // this automatically manages createdAt and updatedAt fields
);

// Index on type field
bikeSchema.index({ type: 1 }, { name: 'type_idx' });

// Bike model
export const Bike: Model<IBike> = mongoose.model<IBike>('Bike', bikeSchema);