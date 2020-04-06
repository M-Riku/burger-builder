import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';

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
        totlePrice: 4
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const newCount = oldCount + 1;
        const newIngredients = { ...this.state.ingredients };
        newIngredients[type] = newCount;
        const oldPrice = this.state.totlePrice;
        const newPrice = oldPrice + INGREDIENTPRICE[type];
        this.setState({
            totlePrice: newPrice,
            ingredients: newIngredients
        });
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;
        const newIngredients = { ...this.state.ingredients };
        newIngredients[type] = newCount;
        const oldPrice = this.state.totlePrice;
        const newPrice = oldPrice - INGREDIENTPRICE[type];
        this.setState({
            totlePrice: newPrice,
            ingredients: newIngredients
        });
    }

    render() {
        const disabledInfo = { ...this.state.ingredients };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    added={this.addIngredientHandler}
                    removed={this.removeIngredientHandler}
                    disabledInfo={disabledInfo}
                    price={this.state.totlePrice} />
            </Aux>
        );
    };
}

export default BurgerBuilder;