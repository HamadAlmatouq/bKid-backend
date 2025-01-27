const express = require('express');
const { query } = require('express-validator');
const { validateRequest } = require('../../middleware');
const Task = require('../../models/task');
const Kid = require('../../models/kid');

const router = express.Router();

router.get(
    '/',
    [
        query('Kname').notEmpty().withMessage('Kid name is required')
    ],
    validateRequest,
    async (req, res) => {
        const { Kname } = req.query;

        // Get the current user's information from the request
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(401).send({ error: 'Not authenticated' });
        }

        // Check if the current user's role is parent
        if (currentUser.role !== 'parent') {
            return res.status(403).send({ error: 'User is not a parent' });
        }

        // Find the kid by the provided Kname
        const kid = await Kid.findOne({ Kname });
        if (!kid) {
            return res.status(404).send({ error: 'Kid not found' });
        }

        // Find completed tasks associated with the kid
        const tasks = await Task.find({ kid: kid._id, completed: true });

        res.status(200).send(tasks);
    }
);

module.exports = router;