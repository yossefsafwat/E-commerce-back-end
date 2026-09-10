import express from 'express'
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/order.controllers.js'
import { authentication  } from "../middleware/auth.middleware.js";
import {validatecreateOrder} from "../middleware/order.middleware.js"

const orderRouter = express.Router()

// orderRouter.use(authentication);

orderRouter.post('/',validatecreateOrder,createOrder)

orderRouter.get('/my', getMyOrders)

orderRouter.get('/my/:id', getOrderById)

orderRouter.patch('/my/:id/cancel', cancelOrder)

export default orderRouter