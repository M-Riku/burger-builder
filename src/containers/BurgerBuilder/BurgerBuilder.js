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
import * as burgerBuilderAction from '../../store/actions/index';

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

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
        this.props.history.push('/checkout');
    }

    render() {
        const disabledInfo = { ...this.props.ings };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.props.error ? <p> ingredients can't be loaded</p> : <Spinner />;

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
        price: state.totalPrice,
        error: state.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderAction.addIgredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderAction.removeIgredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderAction.initIngredients())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));