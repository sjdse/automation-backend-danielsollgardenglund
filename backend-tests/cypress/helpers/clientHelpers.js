const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'
const ENDPOINT_POST_CLIENT = 'http://localhost:3000/api/client/new'


function createRandomClientPayload() {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }
    return payload
}

function UpdatedClientPayload(lastId, lastCreated) {
    const fakeName = faker.name.firstName()
    const fakeEmail = faker.internet.email()
    const fakePhone = faker.phone.phoneNumber()

    const payload = {
        "id": lastId,
        "created": lastCreated,
        "name": fakeName,
        "email": fakeEmail,
        "telephone": fakePhone
    }
    return payload
}

//POSTs (creates) a client and then edits and deletes it through 2 other functions
function createEditDeleteClient() {
    cy.authenticateSession().then((response => {
        let fakeClientPayload = createRandomClientPayload()

        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_CLIENT,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
            expect(responseAsString).to.have.string(fakeClientPayload.email)
        }))
        editRequestAfterGet()
        deleteRequestAfterGet()
    }))
}

//GETs clients to get the id of last client and then edits it
function editRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id
        let lastCreated = response.body[response.body.length - 1].created
        let fakeClientPayload = UpdatedClientPayload(lastId, lastCreated)

        cy.request({
            method: 'PUT',
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeClientPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response)
            expect(responseAsString).to.have.string(fakeClientPayload.name)
            expect(responseAsString).to.have.string(fakeClientPayload.email)
        }))
    }))
}

//GETs clients to get the id of last client and then deletes it
function deleteRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id

        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            expect(response.status).to.eq(200)
        }))
    }))
}

//GETs all clients and asserts that default clients from data.js is there
function getAllClients(clientData) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_CLIENTS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(JSON.stringify(clientData))
        }))
    }))
}

module.exports = {
    createEditDeleteClient,
    getAllClients
}