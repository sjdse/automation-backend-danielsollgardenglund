/// <reference types="cypress" />

import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'
import * as billHelpers from '../helpers/billHelpers'
import * as reservationHelpers from '../helpers/reservationHelpers'
import * as data from '../../../rasi10-hotel-test-vue/server/data'


describe('Backend testing suite', function () {

    it('GET Clients, Rooms, Bills and Reservations', function() {
        billHelpers.getAllBills(data.bills)
        roomHelpers.getAllRooms(data.rooms)
        clientHelpers.getAllClients(data.clients)
        reservationHelpers.getAllReservations(data.reservations)
    })

    it('POST, PUT and DELETE client', function() {
        clientHelpers.createEditDeleteClient()
    })

    it('POST, PUT and DELETE room', function() {
        roomHelpers.createEditDeleteRoom()
    })

    it('POST, PUT and DELETE bill', function() {
        billHelpers.createEditDeleteBill()
    })

    it('POST, PUT and DELETE reservation', function() {
        reservationHelpers.createEditDeleteReservation()
    })



})