import express from 'express'
import { createOrder, getMyOrders, getOrderById, cancelOrder } from '../controllers/order.controllers.js'

const orderRouter = express.Router()

orderRouter.post('/', createOrder)

orderRouter.get('/my', getMyOrders)

orderRouter.get('/my/:id', getOrderById)

orderRouter.patch('/my/:id/cancel', cancelOrder)


export default orderRouter