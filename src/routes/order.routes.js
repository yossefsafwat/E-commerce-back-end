import express from 'express'
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/order.controllers.js'
import { authentication  } from "../middleware/auth.middleware.js";
import {validatecreateOrder} from "../middleware/order.middleware.js"

const orderRouter = express.Router()


orderRouter.post('/', authentication, validatecreateOrder, createOrder)

orderRouter.get('/my', authentication, getMyOrders)

orderRouter.get('/my/:id', authentication, getOrderById)

orderRouter.patch('/my/:id/cancel', authentication, cancelOrder)

export default orderRouter