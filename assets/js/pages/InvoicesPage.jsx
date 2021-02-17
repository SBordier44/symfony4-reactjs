import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import moment from 'moment'
import invoicesAPI from '../services/invoicesAPI'
import {Link, NavLink} from "react-router-dom";

const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'info',
    CANCELED: 'danger'
}

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELED: 'Annulée'
}

const InvoicesPage = props => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            setInvoices(await invoicesAPI.fetchAll());
        } catch (error) {
            console.error(error.response)
        }
    }

    useEffect(() => {
        return fetchInvoices()
    }, []);

    const handlePageChange = page => {
        setCurrentPage(page)
    }

    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }

    const handleDestroy = async id => {
        const originalInvoices = [...invoices]

        setInvoices(invoices.filter(i => i.id !== id))

        try {
            await invoicesAPI.destroy(id)
            console.log('Facture supprimée')
        } catch (error) {
            console.error(error.response)
            setInvoices(originalInvoices)
        }
    }

    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase())
        || i.customer.lastName.toLowerCase().includes(search.toLowerCase())
        || i.amount.toString().startsWith(search.toLowerCase())
        || i.sentAt.toLowerCase().includes(search.toLowerCase())
        || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" className="form-control" placeholder="Rechercher..." onChange={handleSearch}
                       value={search}/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th>Date envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <NavLink to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</NavLink>
                        </td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                                {STATUS_LABELS[invoice.status]}
                            </span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <NavLink className="btn btn-sm btn-primary mr-1" to={"/invoices/" + invoice.id}>Modifier</NavLink>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDestroy(invoice.id)}>
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange}
                        length={filteredInvoices.length}/>
        </>
    )
};

export default InvoicesPage
