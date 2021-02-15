import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from "react-router-dom";

import '../scss/app.scss'
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomersPageWithPagination from "./pages/CustomersPageWithPagination";
import InvoicesPage from "./pages/InvoicesPage";

const App = () => {
    return <HashRouter>
        <Navbar/>
        <main className="container pt-5">
            <Switch>
                <Route path="/customers" component={CustomersPage}/>
                <Route path="/invoices" component={InvoicesPage}/>
                <Route path="/customers_with_pagination" component={CustomersPageWithPagination}/>
                <Route path="/" component={HomePage}/>
            </Switch>
        </main>
    </HashRouter>
}

const rootElement = document.querySelector('#app')
ReactDOM.render(
    <App/>,
    rootElement
)
