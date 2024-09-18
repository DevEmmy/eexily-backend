/**
 * @swagger
 * components:
 *   schemas:
 *     RefillSchedule:
 *       type: object
 *       properties:
 *         gas:
 *           type: string
 *           description: The ID of the gas associated with the refill schedule
 *         pickedUpTime:
 *           type: string
 *           enum:
 *             - 12PM
 *             - 5PM
 *           description: The pickup time for the refill (either 12PM or 5PM)
 *         quantity:
 *           type: number
 *           description: The quantity of gas to be refilled
 *         address:
 *           type: string
 *           description: The address where the refill will be delivered
 *         price:
 *           type: number
 *           description: The price of the refill
 *         deliveryFee:
 *           type: number
 *           description: The delivery fee for the refill
 *         paymentMethod:
 *           type: string
 *           description: The method of payment used for the refill
 *         user:
 *           type: string
 *           description: The ID of the user who scheduled the refill
 *         status:
 *           type: string
 *           enum:
 *             - PENDING
 *             - MATCHED
 *             - PICK_UP
 *             - REFILL
 *             - DISPATCHED
 *             - DELIVERED
 *           description: The current status of the refill schedule
 *         gcode:
 *           type: string
 *           description: A unique generated code for the refill schedule
 *         gasStation:
 *           type: string
 *           description: The ID of the gas station handling the refill
 *         rider:
 *           type: string
 *           description: The ID of the rider assigned to handle the refill
 *         timeScheduled:
 *           type: string
 *           format: date
 *           description: The time the refill was scheduled
 *       required:
 *         - quantity
 *         - address
 *       example:
 *         gas: "60c72b2f5f1b2c001c8e4b21"
 *         pickedUpTime: "12PM"
 *         quantity: 50
 *         address: "123 Main Street"
 *         price: 100
 *         deliveryFee: 10
 *         paymentMethod: "Credit Card"
 *         user: "60c72b2f5f1b2c001c8e4b21"
 *         status: "PENDING"
 *         gcode: "G382B"
 *         gasStation: "60d72b1f6d1b2e001b7e5a92"
 *         rider: "60c72b2f5f1b2c001c8e4b21"
 *         timeScheduled: "2024-09-01T10:00:00.000Z"
 *
 * tags:
 *   - name: RefillSchedule
 *     description: API endpoints for managing refill schedules
 *
 * /refill-schedule:
 *   post:
 *     summary: Create a new refill schedule
 *     tags: [RefillSchedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefillSchedule'
 *     responses:
 *       201:
 *         description: Refill schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefillSchedule'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 * /refill-schedule/{userId}:
 *   get:
 *     summary: Get refill schedules for a specific user
 *     tags: [RefillSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Refill schedules retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RefillSchedule'
 *       400:
 *         description: Bad request
 *       404:
 *         description: No refill schedules found for the user
 *       500:
 *         description: Some server error
 *
 * /refill-schedule/by-gcode/{gcode}:
 *   get:
 *     summary: Get refill schedule by gcode
 *     tags: [RefillSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gcode
 *         schema:
 *           type: string
 *         required: true
 *         description: The gcode of the refill schedule
 *     responses:
 *       200:
 *         description: Refill schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefillSchedule'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Refill schedule not found
 *       500:
 *         description: Some server error
 *
 * /refill-schedule/update-status/{id}:
 *   patch:
 *     summary: Update the status of a refill schedule
 *     tags: [RefillSchedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the refill schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefillSchedule'
 *     responses:
 *       200:
 *         description: Refill schedule status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefillSchedule'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Refill schedule not found
 *       500:
 *         description: Some server error
 */
