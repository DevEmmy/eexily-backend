/**
 * @swagger
 * components:
 *   schemas:
 *     Rider:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user associated with the rider
 *         driverLicense:
 *           type: string
 *           description: The driver's license of the rider (optional)
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: The expiry date of the driver's license (optional)
 *         workPlaceAddress:
 *           type: string
 *           description: The workplace address of the rider (optional)
 *         profilePicture:
 *           type: string
 *           description: URL of the rider's profile picture (optional)
 *         riderType:
 *           type: string
 *           enum: 
 *             - DRIVER
 *             - RIDER
 *           description: The type of rider (either DRIVER or RIDER)
 *         gasStation:
 *           type: string
 *           description: The ID of the associated gas station
 *       required:
 *         - user
 *         - riderType
 *         - gasStation
 *       example:
 *         user: "60c72b2f5f1b2c001c8e4b21"
 *         driverLicense: "D1234567890"
 *         expiryDate: "2024-12-31"
 *         workPlaceAddress: "123 Main Street"
 *         profilePicture: "https://example.com/images/profile.jpg"
 *         riderType: "DRIVER"
 *         gasStation: "60d72b1f6d1b2e001b7e5a92"
 *
 * tags:
 *   - name: Rider
 *     description: API endpoints for managing riders
 *
 * /rider:
 *   post:
 *     summary: Create a new rider
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rider'
 *     responses:
 *       201:
 *         description: Rider created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 * /rider:
 *   get:
 *     summary: Get all riders
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of riders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 * /rider/by-gasstation/{gasStation}:
 *   get:
 *     summary: Get riders by gas station
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gasStation
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the gas station
 *     responses:
 *       200:
 *         description: Riders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       404:
 *         description: No riders found for the gas station
 *       500:
 *         description: Some server error
 *
 * /rider/schedule/{riderId}:
 *   get:
 *     summary: Get the schedule of a rider by rider ID
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the rider
 *     responses:
 *       200:
 *         description: Rider schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Some server error
 *
 * /rider/update/{riderId}:
 *   patch:
 *     summary: Update a rider by rider ID
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the rider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rider'
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Some server error
 */
