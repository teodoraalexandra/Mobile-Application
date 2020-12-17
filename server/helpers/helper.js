const fs = require('fs')
const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
}

function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(r => r.id == id)
        if (!row) {
            reject({
                message: 'No assignment found',
                status: 404
            })
        }
        resolve(row)
    })
}

function writeJSONFile(content) {
    let nonNull = [];
    for (let i = 0; i < content.length; i++) {
        if (content[i] !== null)
            nonNull.push(content[i]);
    }
    fs.writeFileSync('/Users/teodoradan/Desktop/crud-project-2020-teodoraalexandra/server/data/assignments.json', JSON.stringify(nonNull), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    getNewId,
    mustBeInArray,
    writeJSONFile
}