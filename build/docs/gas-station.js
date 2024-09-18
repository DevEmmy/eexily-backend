"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     GasStation:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user associated with the gas station
 *         gasStationName:
 *           type: string
 *           description: The name of the gas station
 *         address:
 *           type: string
 *           description: The address of the gas station
 *         phoneNumber:
 *           type: string
 *           description: The contact phone number for the gas station
 *         accountNumber:
 *           type: string
 *           description: The bank account number associated with the gas station
 *         accountName:
 *           type: string
 *           description: The name on the bank account
 *         bankName:
 *           type: string
 *           description: The name of the bank where the account is held
 *         regCode:
 *           type: string
 *           description: A unique registration code for the gas station
 *       required:
 *         - user
 *         - gasStationName
 *         - address
 *       example:
 *         user: "60c72b2f5f1b2c001c8e4b21"
 *         gasStationName: "Awesome Gas Station"
 *         address: "456 Elm Street"
 *         phoneNumber: "+1234567890"
 *         accountNumber: "123456789012"
 *         accountName: "John Doe"
 *         bankName: "Bank of Example"
 *         regCode: "A1B2C"
 *
 * tags:
 *   - name: GasStation
 *     description: API endpoints for managing gas stations
 *
 * /gas-stations:
 *   post:
 *     summary: Create a new gas station
 *     tags: [GasStation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GasStation'
 *     responses:
 *       201:
 *         description: Gas station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GasStation'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 *   get:
 *     summary: Get all gas stations
 *     tags: [GasStation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all gas stations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GasStation'
 *       500:
 *         description: Some server error
 *
 * /gas-stations/{id}:
 *   get:
 *     summary: Get a gas station by ID
 *     tags: [GasStation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the gas station
 *     responses:
 *       200:
 *         description: Gas station retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GasStation'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas station not found
 *       500:
 *         description: Some server error
 *
 *   put:
 *     summary: Update a gas station by ID
 *     tags: [GasStation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the gas station
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GasStation'
 *     responses:
 *       200:
 *         description: Gas station updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GasStation'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas station not found
 *       500:
 *         description: Some server error
 *
 *   delete:
 *     summary: Delete a gas station by ID
 *     tags: [GasStation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the gas station
 *     responses:
 *       200:
 *         description: Gas station deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas station not found
 *       500:
 *         description: Some server error
 */
