/**
 * @swagger
 * components:
 *   schemas:
 *     IndividualDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the individual
 *         lastName:
 *           type: string
 *           description: The last name of the individual
 *         email:
 *           type: string
 *           description: The email of the individual
 *         userId:
 *           type: string
 *           description: The user associated with this individual
 *       example:
 *         firstName: "John"
 *         lastName: "Doe"
 *         email: "john.doe@example.com"
 *         userId: "60c72b2f5f1b2c001c8e4b21"
 * 
 *     UpdateIndividualDto:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the individual
 *         lastName:
 *           type: string
 *           description: The last name of the individual
 *         email:
 *           type: string
 *           description: The email of the individual
 *       example:
 *         firstName: "Jane"
 *         lastName: "Smith"
 *         email: "jane.smith@example.com"
 *
 * tags:
 *   - name: Individual
 *     description: API endpoints for managing individual data
 *
 * /individual:
 *   post:
 *     summary: Create a new individual entry
 *     tags: [Individual]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IndividualDto'
 *     responses:
 *       201:
 *         description: Individual entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndividualDto'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *
 *   get:
 *     summary: Get all individual entries
 *     tags: [Individual]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Individual entries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IndividualDto'
 *       500:
 *         description: Some server error
 *
 * /individual/{id}:
 *   get:
 *     summary: Get individual entry by ID
 *     tags: [Individual]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The individual ID
 *     responses:
 *       200:
 *         description: Individual entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IndividualDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Individual entry not found
 *       500:
 *         description: Some server error
 *
 * /individual/by-user/{user}:
 *   get:
 *     summary: Get individual entry by user
 *     tags: [Individual]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: string
 *         required: true
 *         description: The user associated with the individual
 *     responses:
 *       200:
 *         description: Individual entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/IndividualDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Individual entry not found
 *       500:
 *         description: Some server error
 *
 * /individual/{id}/update:
 *   patch:
 *     summary: Update individual entry by ID
 *     tags: [Individual]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The individual ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIndividualDto'
 *     responses:
 *       200:
 *         description: Individual entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateIndividualDto'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Individual entry not found
 *       500:
 *         description: Some server error
 */
