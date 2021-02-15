import React, {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithPagination = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [loading, setLoading] = useState(true)

    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member'])
                setTotalItems(response.data['hydra:totalItems'])
            })
            .catch(error => console.error(error.response))
            .finally(() => setLoading(false))
    }, [currentPage]);

    const handleDelete = id => {
        const originalCustomers = [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        axios.delete('/api/customers/' + id)
            .then(() => console.log('Client supprimé'))
            .catch(error => {
                console.error(error.response)
                setCustomers(originalCustomers)
            })
    }

    const handlePageChange = page => {
        setCurrentPage(page)
        setLoading(true)
    }

    return (
        <>
            <h1>Liste des clients (Pagination API)</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {loading && <tr>
                    <td colSpan="7" className="text-center">Chargement...</td>
                </tr>}
                {!loading && customers.map(customer => <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                        <span className="badge badge-primary">
                            {customer.invoices.length}
                        </span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button className="btn btn-sm btn-danger" disabled={customer.invoices.length > 0}
                                onClick={() => handleDelete(customer.id)}>
                            Supprimer
                        </button>
                    </td>
                </tr>)}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems}
                        onPageChange={handlePageChange}/>
        </>
    )
}

export default CustomersPageWithPagination
