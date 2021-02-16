import React, {useContext, useState} from 'react';
import {Redirect} from 'react-router-dom'
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({history}) => {

    const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')

    const handleChangeField = ({currentTarget}) => {
        setCredentials({
            ...credentials,
            [currentTarget.name]: currentTarget.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        try {
            await authAPI.authenticate(credentials)
            setError('')
            setIsAuthenticated(true)
            history.replace('/customers')
        } catch (error) {
            setError("Les informations d'identification renseignés sont invalides")
        }
    }

    return (
        <>
            {isAuthenticated && <Redirect to="/customers"/>}
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field name="username"
                       value={credentials.username}
                       label="Adresse Email"
                       placeholder="Adresse Email de connexion"
                       type="email"
                       onChange={handleChangeField}
                       error={error}
                       required={false}
                />
                <Field name="password"
                       label="Mot de passe"
                       placeholder="Votre mot de passe"
                       type="password"
                       onChange={handleChangeField}
                       value={credentials.password}
                       required={true}
                />
                <div className="div form-group">
                    <button className="btn btn-success" type="submit">
                        Connexion
                    </button>
                </div>
            </form>
        </>
    )
};

export default LoginPage
