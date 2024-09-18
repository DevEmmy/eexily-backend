/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications for the authenticated user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     description: The ID of the user receiving the notification
 *                   message:
 *                     type: string
 *                     description: The notification message
 *                   action:
 *                     type: string
 *                     description: The action URL for the notification, if any
 *                   actionLabel:
 *                     type: string
 *                     description: The label for the action, if any
 *                   notificationType:
 *                     type: string
 *                     description: The type of notification (e.g., info, warning)
 *                   read:
 *                     type: boolean
 *                     description: Indicates if the notification has been read
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp when the notification was created
 *       401:
 *         description: Unauthorized, user is not authenticated
 *       500:
 *         description: Some server error
 */
