import mongoose from "mongoose";

/**
 * TODO: Validate MongoDB ObjectId
 *
 * - Check if req.params.id is valid using mongoose.Types.ObjectId.isValid()
 * - If invalid, return 400: { error: { message: "Invalid id" } }
 * - If valid, call next()
 */
export function validateObjectId(req, res, next) {
  const result = mongoose.Types.ObjectId.isValid(req.params.id);

  if (!result) {
    return res.status(400).json({
      error: { message: "Invalid id" },
    });
  }

  return next();
}
