const faker = require('faker')

const ENDPOINT_GET_RESERVATIONS = 'http://localhost:3000/api/reservations'
const ENDPOINT_GET_RESERVATION = 'http://localhost:3000/api/reservation/'
const ENDPOINT_POST_RESERVATION = 'http://localhost:3000/api/reservation/new'


function createRandomReservationPayload() {
    //random date has time in it which looks messy but it works for now so i'll leave it
    const randomStartDate = faker.date.recent(365)
    const randomEndDate = faker.date.soon(365)
    const randomClient = faker.datatype.number({ min: 1, max: 3 })
    const randomRoom = faker.datatype.number({ min: 1, max: 2 })
    const randomBill = faker.datatype.number({ min: 1, max: 1 })

    const payload = {
        "client": randomClient,
        "room": randomRoom,
        "bill": randomBill,
        "start": randomStartDate,
        "end": randomEndDate
    }
    return payload
}

function UpdatedReservationPayload(lastId, lastCreated) {
    const randomStartDate = faker.date.recent(365)
    const randomEndDate = faker.date.soon(365)
    const randomClient = faker.datatype.number({ min: 1, max: 3 })
    const randomRoom = faker.datatype.number({ min: 1, max: 2 })
    const randomBill = faker.datatype.number({ min: 1, max: 1 })

    const payload = {
        "id": lastId,
        "created": lastCreated,
        "client": randomClient,
        "room": randomRoom,
        "bill": randomBill,
        "start": randomStartDate,
        "end": randomEndDate
    }
    return payload
}

//POSTs (creates) a reservation and then edits and deletes it through 2 other functions
function createEditDeleteReservation() {
    cy.authenticateSession().then((response => {
        let fakeReservationPayload = createRandomReservationPayload()

        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_RESERVATION,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeReservationPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.contain(JSON.stringify(fakeReservationPayload.start))
            expect(responseAsString).to.contain(JSON.stringify(fakeReservationPayload.end))
        }))
        editRequestAfterGet()
        deleteRequestAfterGet()
    }))
}

//GETs reservations to get the id of last reservation and then edits it
function editRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_RESERVATIONS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id
        let lastCreated = response.body[response.body.length - 1].created
        let fakeReservationPayload = UpdatedReservationPayload(lastId, lastCreated)

        cy.request({
            method: 'PUT',
            url: ENDPOINT_GET_RESERVATION + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeReservationPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.contain(JSON.stringify(fakeReservationPayload.start))
            expect(responseAsString).to.contain(JSON.stringify(fakeReservationPayload.end))
        }))
    }))
}

//GETs reservations to get the id of last reservation and then deletes it
function deleteRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_RESERVATIONS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id

        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_RESERVATION + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            expect(response.status).to.eq(200)
        }))
    }))
}

//GETs all reservations and asserts that default reservation from data.js is there
function getAllReservations(reservationData) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_RESERVATIONS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(JSON.stringify(reservationData))
        }))
    }))
}

module.exports = {
    createEditDeleteReservation,
    getAllReservations
}