import React, { Component } from 'react';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders';

const INGREDIENTPRICE = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(
            key => ingredients[key]
        ).reduce((arr, el) => arr + el, 0);
        this.setState({ purchasable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        const newIngredients = { ...this.state.ingredients };
        newIngredients[type] = newCount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + INGREDIENTPRICE[type];
        this.setState({
            totalPrice: newPrice,
            ingredients: newIngredients
        });
        this.updatePurchaseState(newIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;
        const newIngredients = { ...this.state.ingredients };
        newIngredients[type] = newCount;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENTPRICE[type];
        this.setState({
            totalPrice: newPrice,
            ingredients: newIngredients
        });
        this.updatePurchaseState(newIngredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: "lu minghao",
                address: {
                    street: 'Teststreet 1',
                    zipCode: '2110041',
                    country: 'China'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order).then(
            response => {
                this.setState({ loading: false, purchasing: false });
            }
        ).catch(
            error => {
                this.setState({ loading: false, purchasing: false });
            }
        );
    }

    render() {
        const disabledInfo = { ...this.state.ingredients };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = <OrderSummary
            price={this.state.totalPrice}
            ingredients={this.state.ingredients}
            purchaseCanclled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />
        if (this.state.loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    added={this.addIngredientHandler}
                    removed={this.removeIngredientHandler}
                    disabledInfo={disabledInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    ordered={this.purchaseHandler} />
            </Aux>
        );
    };
}

export default withErrorHandler(BurgerBuilder, axios);