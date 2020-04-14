import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }

    componentWillMount() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;
        for (let param of query.entries()) {
            if (param[0] === 'price') {
                price = +param[1];
            } else {
                ingredients[param[0]] = +param[1];
            }
        }
        this.setState({ ingredients: ingredients, totalPrice: price });
    }

    canceledHandler = () => {
        this.props.history.goBack();
    }

    continuedHandler = () => {

        this.props.history.push('/checkout/contact-data');
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    cancelled={this.canceledHandler}
                    continued={this.continuedHandler} />
                <Route
                    path={this.props.match.path + '/contact-data'}
                    render={() => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} />)} />
            </div>
        );
    }
}

export default Checkout;