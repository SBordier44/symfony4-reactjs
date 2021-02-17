import axios from "axios";

function fetchAll() {
    return axios
        .get('/api/invoices')
        .then(response => response.data['hydra:member'])
}

function destroy(id) {
    return axios
        .delete('/api/invoices/' + id)
}

function find(id) {
    return axios
        .get('/api/invoices/' + id)
        .then(response => response.data)
}

function edit(id, payload) {
    return axios
        .put('/api/invoices/' + id, {
            ...payload, customer: '/api/customers/' + payload.customer
        })
        .then(response => response.data)
}

function create(payload) {
    return axios
        .post('/api/invoices', {
            ...payload, customer: `/api/customers/${payload.customer}`
        })
        .then(response => response.data)
}

export default {
    fetchAll, destroy, find, edit, create
}
