const faker = require('faker')

const ENDPOINT_GET_BILLS = 'http://localhost:3000/api/bills'
const ENDPOINT_GET_BILL = 'http://localhost:3000/api/bill/'
const ENDPOINT_POST_BILL = 'http://localhost:3000/api/bill/new'


function createRandomBillPayload() {
    const randomValue = faker.datatype.number({ min: 1000, max: 10000 })
    const randomPaid = faker.datatype.boolean()

    const payload = {
        "value": randomValue,
        "paid": randomPaid
    }
    return payload
}

function UpdatedBillPayload(lastId, lastCreated) {
    const randomValue = faker.datatype.number({ min: 1000, max: 10000 })
    const randomPaid = faker.datatype.boolean()

    const payload = {
        "value": randomValue,
        "paid": randomPaid,
        "id": lastId,
        "created": lastCreated
    }
    return payload
}

//POSTs (creates) a bill and then edits and deletes it through 2 other functions
function createEditDeleteBill() {
    cy.authenticateSession().then((response => {
        let fakeBillPayload = createRandomBillPayload()

        cy.request({
            method: 'POST',
            url: ENDPOINT_POST_BILL,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeBillPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response) 
            expect(responseAsString).to.have.string(fakeBillPayload.value) 
            expect(responseAsString).to.have.string(fakeBillPayload.paid) 
        }))
        editRequestAfterGet()
        deleteRequestAfterGet()
    }))
}

//GETs bills to get the id of last bill and then edits it
function editRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_BILLS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id
        let lastCreated = response.body[response.body.length - 1].created
        let fakeBillPayload = UpdatedBillPayload(lastId, lastCreated)

        cy.request({
            method: 'PUT',
            url: ENDPOINT_GET_BILL + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: fakeBillPayload
        }).then((response => {
            const responseAsString = JSON.stringify(response) 
            expect(responseAsString).to.have.string(fakeBillPayload.value) 
            expect(responseAsString).to.have.string(fakeBillPayload.paid) 
        }))
    }))
}

//GETs bills to get the id of last bill and then deletes it
function deleteRequestAfterGet() {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_BILLS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        expect(response.status).to.eq(200)

        let lastId = response.body[response.body.length - 1].id

        cy.request({
            method: 'DELETE',
            url: ENDPOINT_GET_BILL + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            expect(response.status).to.eq(200)
        }))
    }))
}

//GETs all bills and asserts that default bill from data.js is there
function getAllBills(billData) {
    cy.authenticateSession().then((response => {
        cy.request({
            method: 'GET',
            url: ENDPOINT_GET_BILLS,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            const responseAsString = JSON.stringify(response.body)
            expect(responseAsString).to.have.string(JSON.stringify(billData))
        }))
    }))
}

module.exports = {
    getAllBills,
    createEditDeleteBill
}