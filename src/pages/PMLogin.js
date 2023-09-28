import React, { useEffect, useState } from 'react';
import { validateEmail } from '../components/GenericComponents/Validations';
import Form from '../components/GenericComponents/Form';
import APICaller from '../components/GenericComponents/APICaller';
import Toast from '../components/GenericComponents/Toast';
import Cookies from 'universal-cookie';
import { decodeToken } from '../components/GenericComponents/Utilities';
const { REACT_APP_TOKEN_URL } = process.env

const Login = () => {
    const [loginUserResponse, setLoginUserResponse] = useState()
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const cookies = new Cookies();

    useEffect(() => {
        if(localStorage.getItem('sessionExpired')) {
            toastSetting('error', 'Session Expired', 'Please login again.', true)

            setTimeout(() => {
                toastSetting('', '', '', false)
                localStorage.removeItem('sessionExpired')
            }, 5000)
        }
    }, [])

    useEffect(() => {
        if (loginUserResponse) {
            if (loginUserResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', loginUserResponse.message, 'Failed to login user.', true)
                    localStorage.removeItem('formSubmit')
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    localStorage.removeItem('formSubmit')
                    toastSetting('success', 'Success', 'User has been logged in successfully.', true)

                    const decoded = decodeToken(loginUserResponse.token)
                    const userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                    const maxAge = decoded["exp"]

                    cookies.set('loggedInUser', userName, { path: '/', maxAge: maxAge, sameSite: true })
                }, 1000)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                    window.location.href = './#/invoices'
                }, 3000)
            }
        }
    }, [loginUserResponse])

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    const goToDashboard = () => {
        window.location.href = './#/invoices'
    }

    const loginSchema = [
        {
            div: [
                { type: 'text', name: 'username', placeholder: 'Username', icon: 'user', required: true },
            ]
        },
        {
            div: [
                { type: 'password', name: 'password', placeholder: 'Password', icon: 'lock', required: true },
            ]
        },
    ]

    const loginUser = async (data) => {
        const request = {
            url: `${REACT_APP_TOKEN_URL}/user/login`,
            type: 'post',
            payload: data
        }

        let loginUserResponse = await APICaller(request)
        setLoginUserResponse(loginUserResponse)
    }

    const getData = (formValues) => {
        const loginPayload = {
            userName: formValues.username,
            password: formValues.password
        }

        loginUser(loginPayload)
    }

    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-panel" style={{ justifyContent: "space-around" }}>
                    <img src="assets/layout/images/medical.png" className="logo" alt="diamond-layout" />

                    <div className="login-form">
                        <h2>Login</h2>
                        <p>
                            Don't have an account? <a href="./#/register">Register</a>
                        </p>
                        <Form submitText='Login' schema={loginSchema} submit={getData} hideCancelBtn />
                    </div>
                </div>
                <div className="login-image">
                    <div className="login-image-content">
                        <h1>Patient</h1>
                        <h1>Management</h1>
                        <h1>System</h1>
                    </div>
                </div>
                {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
            </div>
        </div>
    );
};

export default Login