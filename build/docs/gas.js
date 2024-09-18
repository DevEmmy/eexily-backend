"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     GasDto:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           description: The size of the gas cylinder
 *         houseHoldSize:
 *           type: number
 *           description: The size of the household using the gas
 *         primaryCookingAppliance:
 *           type: string
 *           description: The primary cooking appliance using the gas
 *         ownedBy:
 *           type: string
 *           description: The user who owns the gas
 *       example:
 *         size: "12kg"
 *         houseHoldSize: 4
 *         primaryCookingAppliance: "Gas stove"
 *         ownedBy: "60c72b2f5f1b2c001c8e4b21"
 *
 *     UpdateGasDto:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           description: The size of the gas cylinder
 *         houseHoldSize:
 *           type: number
 *           description: The size of the household using the gas
 *         primaryCookingAppliance:
 *           type: string
 *           description: The primary cooking appliance using the gas
 *         ownedBy:
 *           type: string
 *           description: The user who owns the gas
 *       example:
 *         size: "15kg"
 *         houseHoldSize: 5
 *         primaryCookingAppliance: "Electric stove"
 *         ownedBy: "60c72b2f5f1b2c001c8e4b21"
 *
 * tags:
 *   - name: Gas
 *     description: API endpoints for managing gas data
 *
 * /gas:
 *   post:
 *     summary: Create a new gas entry
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GasDto'
 *     responses:
 *       201:
 *         description: Gas entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GasDto'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 *   get:
 *     summary: Get all gas entries
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gas entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GasDto'
 *       500:
 *         description: Some server error
 *
 * /gas/{id}:
 *   get:
 *     summary: Get gas entry by ID
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gas ID
 *     responses:
 *       200:
 *         description: Gas entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GasDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas entry not found
 *       500:
 *         description: Some server error
 *
 *   put:
 *     summary: Update gas entry by ID
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gas ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGasDto'
 *     responses:
 *       200:
 *         description: Gas entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateGasDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas entry not found
 *       500:
 *         description: Some server error
 *
 *   delete:
 *     summary: Delete gas entry by ID
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The gas ID
 *     responses:
 *       200:
 *         description: Gas entry deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Gas entry not found
 *       500:
 *         description: Some server error
 *
 * /gas/appliance/{appliance}:
 *   get:
 *     summary: Find gas entries by appliance
 *     tags: [Gas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appliance
 *         schema:
 *           type: string
 *         required: true
 *         description: The primary cooking appliance
 *     responses:
 *       200:
 *         description: Gas entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GasDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: No gas entries found
 *       500:
 *         description: Some server error
 */
