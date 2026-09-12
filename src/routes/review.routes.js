import express from "express"
import {addReview} from "../controllers/review.controllers.js"
import  {authentication}  from "../middleware/auth.middleware.js"

const router= express.Router()
router.post("/:productId/reviews",authentication,addReview)



export default router