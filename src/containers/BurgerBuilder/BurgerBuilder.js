import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';
import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    // componentWillMount() {
    //     axios.get('/ingredients.json').then(
    //         response => {
    //             const ingredients = response.data;
    //             let price = Object.keys(ingredients).reduce(
    //                 (arr, key) => ingredients[key] * INGREDIENTPRICE[key] + arr, 0);
    //             price = price + this.state.totalPrice;
    //             this.setState({ ingredients: ingredients, totalPrice: price });
    //         }
    //     ).catch(
    //         error => {
    //             this.setState({ error: true });
    //         }
    //     );
    // }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(
            key => ingredients[key]
        ).reduce((arr, el) => arr + el, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        const queryParam = [];
        for (let i in this.props.ings) {
            queryParam.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]))
        }
        queryParam.push('price=' + this.props.price);
        const queryString = queryParam.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        const disabledInfo = { ...this.props.ings };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error ? <p> ingredients can't be loaded</p> : <Spinner />;

        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        added={this.props.onIngredientAdded}
                        removed={this.props.onIngredientRemoved}
                        disabledInfo={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHandler} />
                </Aux>);
            orderSummary = <OrderSummary
                price={this.props.price}
                ingredients={this.props.ings}
                purchaseCanclled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    };
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName }),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));