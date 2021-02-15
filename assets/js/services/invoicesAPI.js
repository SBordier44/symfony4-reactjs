import axios from "axios";

function fetchAll() {
    return axios.get('/api/invoices').then(response => response.data['hydra:member'])
}

function destroy(id) {
    return axios.delete('/api/invoices/' + id)
}

export default {
    fetchAll, destroy
}
