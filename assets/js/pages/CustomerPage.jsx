import React, {useEffect, useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({history, match}) => {

    const {id = "new"} = match.params

    const emptyCustomerModel = {
        lastName: '',
        firstName: '',
        email: '',
        company: ''
    }

    const [customer, setCustomer] = useState(emptyCustomerModel)
    const [errors, setErrors] = useState(emptyCustomerModel)
    const [editing, setEditing] = useState(false)

    const fetchCustomer = async id => {
        try {
            const {firstName, lastName, email, company} = await customersAPI.find(id)
            setCustomer({firstName, lastName, email, company})
        } catch (error) {
            console.error(error.response)
            history.replace('/customers')
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setEditing(true)
            fetchCustomer(id)
        }
    }, [id]);

    const handleChangeField = ({currentTarget}) => {
        setCustomer({
            ...customer,
            [currentTarget.name]: currentTarget.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            if (editing) {
                await customersAPI.edit(id, customer)
                console.log('Client modifié')
            } else {
                await customersAPI.create(customer)
                console.log('Client Créé')
                history.replace('/customers')
            }
            setErrors(emptyCustomerModel)
        } catch ({response}) {
            const {violations} = response.data
            if (violations) {
                const apiErrors = {}
                violations.map(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            } else {
                console.error(response)
            }
        }
    }

    return (
        <>
            {editing && <h1>Modification d'un client</h1> || <h1>Création d'un client</h1>}
            <form onSubmit={handleSubmit}>
                <Field name="lastName"
                       label="Nom de famille"
                       placeholder="Nom de famille du client"
                       value={customer.lastName}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.lastName}
                />
                <Field name="firstName"
                       label="Prénom"
                       placeholder="Prénom du client"
                       value={customer.firstName}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.firstName}
                />
                <Field name="email"
                       label="Email"
                       placeholder="Adresse Email du client"
                       value={customer.email}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.email}
                />
                <Field name="company"
                       label="Entreprise"
                       placeholder="Entreprise du client"
                       value={customer.company}
                       onChange={handleChangeField}
                       required={true}
                       error={errors.company}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    )
}

export default CustomerPage
