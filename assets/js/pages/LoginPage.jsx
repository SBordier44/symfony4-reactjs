import React, {useContext, useState} from 'react';
import {Redirect} from 'react-router-dom'
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext";

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
                <div className="form-group">
                    <label htmlFor="username">Adresse Email</label>
                    <input type="email" className={"form-control" + (error && " is-invalid")}
                           placeholder="Adresse Email de connexion"
                           name="username" id="username" value={credentials.username} onChange={handleChangeField}
                           required/>
                    {error && <p className="invalid-feedback">
                        {error}
                    </p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" className="form-control" placeholder="Votre mot de passe" name="password"
                           id="password" onChange={handleChangeField} required/>
                </div>
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
