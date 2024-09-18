/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the notification
 *         message:
 *           type: string
 *           description: The content of the notification message
 *         action:
 *           type: string
 *           description: An optional action URL related to the notification
 *         actionLabel:
 *           type: string
 *           description: An optional label for the action (e.g., "Refill Now")
 *         notificationType:
 *           type: string
 *           description: The type of notification (e.g., "order", "refill")
 *         read:
 *           type: boolean
 *           description: Indicates whether the notification has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the notification was created
 *       required:
 *         - userId
 *         - message
 *       example:
 *         userId: "60c72b2f5f1b2c001c8e4b21"
 *         message: "Your order has been shipped!"
 *         action: "https://example.com/track-order"
 *         actionLabel: "Track Order"
 *         notificationType: "order"
 *         read: false
 *         createdAt: "2024-09-17T12:34:56Z"
 *
 * tags:
 *   - name: Notification
 *     description: API endpoints for managing notifications
 *
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 * /notifications/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Some server error
 *
 * /notifications:
 *   get:
 *     summary: Get all notifications for a user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Some server error
 *
 * /notifications/{id}:
 *   patch:
 *     summary: Update a notification by ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Some server error
 *
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Some server error
 */
