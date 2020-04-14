import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
                this.setState({ loading: false });
            }
        ).catch(
            error => {
                this.setState({ loading: false });
            }
        );
    }

    render() {
        let form = (
            <form>
                <input className={classes.Input} type='text' name='name' placeholder='Your Name' />
                <input className={classes.Input} type='email' name='email' placeholder='Your Mail' />
                <input className={classes.Input} type='text' name='street' placeholder='Your Street' />
                <input className={classes.Input} type='text' name='Postal' placeholder='Your Postal Code' />
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
                <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
            </div>
        );
    }
}

export default ContactData;