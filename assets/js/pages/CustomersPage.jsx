import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import customersAPI from "../services/customersAPI";
import {Link, NavLink} from "react-router-dom";

const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    const fetchCustomers = async () => {
        try {
            setCustomers(await customersAPI.findAll())
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async id => {
        const originalCustomers = [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        try {
            await customersAPI.destroy(id)
            console.log('Client supprimé')
        } catch (error) {
            console.error(error.response)
            setCustomers(originalCustomers)
        }
    }

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    const itemsPerPage = 10;

    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase())
        || c.lastName.toLowerCase().includes(search.toLowerCase())
        || c.email.toLowerCase().includes(search.toLowerCase())
        || (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
        || (c.user.email && c.user.email.toLowerCase().includes(search.toLowerCase()))
    )

    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." onChange={handleSearch}
                       value={search}/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Proprietaire</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {paginatedCustomers.map(customer => <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.firstName} {customer.lastName}</td>
                    <td>{customer.user.email}</td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">
                        <span className="badge badge-primary">
                            {customer.invoices.length}
                        </span>
                    </td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <NavLink className="btn btn-sm btn-primary mr-1"
                                 to={"/customers/" + customer.id}>Modifier</NavLink>
                        <button className="btn btn-sm btn-danger" disabled={customer.invoices.length > 0}
                                onClick={() => handleDelete(customer.id)}>
                            Supprimer
                        </button>
                    </td>
                </tr>)}
                </tbody>
            </table>
            {itemsPerPage < filteredCustomers.length && (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                            onPageChange={handlePageChange}/>)
            }
        </>
    )
};

export default CustomersPage
