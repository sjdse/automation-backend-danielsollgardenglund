const faker = require('faker')

const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'
const ENDPOINT_POST_ROOM = 'http://localhost:3000/api/room/new'

function createRandomRoomPayload() {
    const randomCategory = faker.random.arrayElement(["single", "double", "twin"])
    const randomNumber = faker.datatype.number({ min: 1, max: 999 })
    const randomFloor = faker.datatype.number({ min: 1, max: 999 })
    const randomAvailability = faker.datatype.boolean()
    const randomPrice = faker.datatype.number({ min: 1000, max: 10000 })
    const randomFeature = faker.random.arrayElement(["balcony", "ensuite", "sea_view", "penthouse"])

    const payload = {
        "features": [randomFeature],
        "category": randomCategory,
        "number": randomNumber,
        "floor": randomFloor,
        "available": randomAvailability,
        "price": randomPrice
    }
    return payload
}

function UpdatedRoomPayload(lastId, lastCreated) {
    const randomCategory = faker.random.arrayElement(["single", "double", "twin"])
    const randomNumber = faker.datatype.number({ min: 1, max: 999 })
    const randomFloor = faker.datatype.number({ min: 1, max: 999 })
    const randomAvailability = faker.datatype.boolean()
    const randomPrice = faker.datatype.number({ min: 1000, max: 10000 })
    const randomFeature = faker.random.arrayElement(["balcony", "ensuite", "sea_view", "penthouse"])

    const payload = {
        "features": [randomFeature],
        "category": randomCategory,
        "number": randomNumber,
        "floor": randomFloor,
        "available": randomAvailability,
        "price": randomPrice,
        "id":lastId,
        "created":lastCreated
    }
    return payload
}

//POSTs (creates) a room and then edits and deletes it through 2 other functions
function createEditDeleteRoom() {
    cy.authenticateSession().then((response => {
        let fakeRoomPayload = createRandomRoomPayload()

        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_ROOM,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeRoomPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response) 
            expect(responseAsString).to.have.string(fakeRoomPayload.number) 
            expect(responseAsString).to.have.string(fakeRoomPayload.floor) 
        }))
        editRequestAfterGet()
        deleteRequestAfterGet()
    }))
}

//GETs rooms to get the id of last room and then edits it
function editRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id
        let lastCreated = response.body[response.body.length - 1].created
        let fakeRoomPayload = UpdatedRoomPayload(lastId, lastCreated)

        cy.request({
            method: 'PUT',
            url: ENDPOINT_GET_ROOM + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeRoomPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response) 
            expect(responseAsString).to.have.string(fakeRoomPayload.number) 
            expect(responseAsString).to.have.string(fakeRoomPayload.floor) 
        }))
    }))
}

//GETs rooms to get the id of last room and then deletes it
function deleteRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id

        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_ROOM + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            expect(response.status).to.eq(200)
        }))
    }))
}

//GETs all rooms and asserts that default rooms from data.js is there
function getAllRooms(roomData) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_ROOMS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(JSON.stringify(roomData))
        }))
    }))
}


module.exports = {
    createEditDeleteRoom,
    getAllRooms
}