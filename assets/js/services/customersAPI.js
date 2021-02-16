import axios from "axios";

function findAll() {
    return axios
        .get("/api/customers")
        .then(response => response.data['hydra:member'])
}

function destroy(id) {
    return axios.delete('/api/customers/' + id)
}

function find(id) {
    return axios
        .get('/api/customers/' + id)
        .then(response => response.data)
}

function edit(id, payload) {
    return axios
        .put('/api/customers/' + id, payload)
        .then(response => response.data)
}

function create(payload) {
    return axios
        .post('/api/customers', payload)
        .then(response => response.data)
}

export default {
    findAll,
    destroy,
    find,
    create,
    edit
}
