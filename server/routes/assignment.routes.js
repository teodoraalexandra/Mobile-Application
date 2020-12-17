const express = require('express')
const router = express.Router()
const assignment = require('../models/assignment.model')
const middleware = require('../helpers/middlewares')

/* All assignments */
router.get('/', async (req, res) => {
    await assignment.getAssignments()
        .then(assignments => res.json(assignments))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

/* An assignment by id */
router.get('/:id', middleware.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await assignment.getAssignment(id)
        .then(assignment => res.json(assignment))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            } else {
                res.status(500).json({ message: err.message })
            }
        })
})

/* Insert a new assignment */
router.post('/', async (req, res) => {
    console.log(req.body);
    if (req.body.length !== 0) {
        await assignment.insertAssignment(req.body)
            .then(assignment => res.status(201).json({
                message: `The assignment #${assignment.id} has been created`,
                content: assignment
            }))
            .catch(err => res.status(500).json({message: err.message}))
    }
})

/* Update an assignment */
router.put('/:id', middleware.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await assignment.updateAssignment(id, req.body)
        .then(assignment => res.json({
            message: `The assignment #${id} has been updated`,
            content: assignment
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

/* Delete a assignment */
router.delete('/:id', middleware.mustBeInteger, async (req, res) => {
    const id = req.params.id

    await assignment.deleteAssignment(id)
        .then(assignment => res.json({
            message: `The assignment #${id} has been deleted`
        }))
        .catch(err => {
            if (err.status) {
                res.status(err.status).json({ message: err.message })
            }
            res.status(500).json({ message: err.message })
        })
})

module.exports = router