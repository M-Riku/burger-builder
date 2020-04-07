import React from 'react';
import BuildControl from './BuildControl/BuildControl';

import classes from './BuildControls.module.css';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' }
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <div>Current Price: <strong>{props.price.toFixed(2)}$</strong></div>
        {controls.map(
            control => (
                <BuildControl
                    key={control.label}
                    label={control.label}
                    added={() => props.added(control.type)}
                    removed={() => props.removed(control.type)}
                    disabledInfo={props.disabledInfo[control.type]} />
            ))}
        <button
            className={classes.OrderButton}
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
    </div>
);

export default buildControls;