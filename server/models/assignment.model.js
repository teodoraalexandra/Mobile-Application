const repository = '../data/assignments.json'
let assignments = require(repository)
const helper = require('../helpers/helper.js')

function getAssignments() {
    return new Promise((resolve, reject) => {
        if (assignments.length === 0) {
            reject({
                message: 'No assignments available',
                status: 202
            })
        }
        resolve(assignments)
    })
}

function getAssignment(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(assignments, id)
            .then(assignment => resolve(assignment))
            .catch(err => reject(err))
    })
}

function insertAssignment(newAssignment) {
    return new Promise((resolve, reject) => {
        const id = { id: helper.getNewId(assignments) }
        newAssignment = { ...id, ...newAssignment }
        assignments.push(newAssignment)
        helper.writeJSONFile(assignments)
        resolve(newAssignment)
    })
}

function updateAssignment(id, newAssignment) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(assignments, id)
            .then(assignment => {
                const index = assignments.findIndex(p => p.id == assignment.id)
                id = { id: assignment.id }
                assignments[index] = { ...id, ...newAssignment }
                helper.writeJSONFile(assignments)
                resolve(assignments[index])
            })
            .catch(err => reject(err))
    })
}

function deleteAssignment(id) {
    return new Promise((resolve, reject) => {
        helper.mustBeInArray(assignments, id)
            .then(assignment => {
                const index = assignments.findIndex(p => p.id == assignment.id)
                assignments.splice(index, 1)
                helper.writeJSONFile(assignments)
                resolve(assignment[index])
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    insertAssignment: insertAssignment,
    getAssignments: getAssignments,
    getAssignment: getAssignment,
    updateAssignment: updateAssignment,
    deleteAssignment: deleteAssignment
}