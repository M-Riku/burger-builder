import React from 'react';

import Aux from '../../../hoc/Aux/Aux';
import Logo from '../../Logo/Logo';
import Backdrop from '../../UI/Backdrop/Backdrop';
import NavigaationItems from '../NavigaationItems/NavigationItems';
import classes from './SideDrawer.module.css';

const sideDrawer = (props) => {
    let attachedClasses = [classes.SideDrawer, classes.Close];

    if (props.show) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }

    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.clicked} />
            <div className={attachedClasses.join(' ')} onClick={props.clicked}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigaationItems isAuth={props.isAuth} />
                </nav>
            </div>
        </Aux>
    );
};

export default sideDrawer;