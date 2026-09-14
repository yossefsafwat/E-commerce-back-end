import express from "express"
import {addReview,getReview,deleteReview} from "../controllers/review.controller.js"
import  {authentication}  from "../middleware/auth.middleware.js"

const router= express.Router()
router.post("/:productId/reviews",authentication,addReview)
router.get("/:productId/reviews",getReview)
router.delete("/:productId/reviews/:reviewId",authentication,deleteReview)

export default router