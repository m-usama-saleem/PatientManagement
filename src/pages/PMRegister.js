import React, { useEffect, useState } from 'react';
import APICaller from '../components/GenericComponents/APICaller';
import Loader from '../components/GenericComponents/Loader';
import { validateEmail } from '../components/GenericComponents/Validations';
import Form from '../components/GenericComponents/Form';
import Toast from '../components/GenericComponents/Toast';
const { REACT_APP_TOKEN_URL } = process.env

const Register = () => {
    const [rolesResponse, setRolesResponse] = useState()
    const [userRoles, setUserRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [registerUserResponse, setRegisterUserResponse] = useState()

    const registerSchema = [
        {
            div: [
                { type: 'text', name: 'username', placeholder: 'Username', icon: 'user', required: true },
            ]
        },
        {
            div: [
                { type: 'text', name: 'email', placeholder: 'Email', icon: 'envelope', validation: validateEmail, required: true },
            ]
        },
        {
            div: [
                { type: 'number', name: 'contact', placeholder: 'Contact #', icon: 'mobile', required: true },
            ]
        },
        {
            div: [
                { type: 'select', name: 'role', placeholder: 'Select a User Role', options: userRoles, optionName: 'normalizedName', required: true, searchable: true },
            ]
        },
        {
            div: [
                { type: 'password', name: 'password', placeholder: 'Password', icon: 'lock', required: true },
            ]
        },
        {
            div: [
                { type: 'password', name: 'confirm_password', placeholder: 'Confirm Password', icon: 'lock', required: true },
            ]
        },
    ]

    const goToLogin = () => {
        window.location.href = '/'
    }

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    useEffect(() => {
        if (rolesResponse) {
            if (rolesResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', rolesResponse.message, 'Failed to fetch User Roles.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setUserRoles(rolesResponse)

                setTimeout(() => {
                    setLoading(false)
                }, 2000)
            }
        }
    }, [rolesResponse])

    useEffect(() => {
        if (registerUserResponse) {
            if (registerUserResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', registerUserResponse.message, 'Failed to register user.', true)
                    localStorage.removeItem('formSubmit')
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    localStorage.removeItem('formSubmit')
                    toastSetting('success', 'Success', 'User has been registered successfully.', true)
                }, 1000)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                    window.location.href = './#/invoices'
                }, 3000)
            }
        }
    }, [registerUserResponse])

    const fetchRoles = async () => {
        const request = {
            url: `${REACT_APP_TOKEN_URL}/user/roles`,
            type: 'get'
        }

        let rolesResponse = await APICaller(request)
        setRolesResponse(rolesResponse)
    }

    const registerUser = async (data) => {
        const request = {
            url: `${REACT_APP_TOKEN_URL}/user/register`,
            type: 'post',
            payload: data
        }

        let registerUserResponse = await APICaller(request)
        setRegisterUserResponse(registerUserResponse)
    }

    const getData = (formValues) => {
        if(formValues.password != formValues.confirm_password) {
            setTimeout(() => {
                toastSetting('error', "Error", 'Password and confirm password does not match.', true)
                localStorage.removeItem('formSubmit')
            }, 500)

            setTimeout(() => {
                toastSetting('', '', '', false)
            }, 3000)
        } else {
            const registerPayload = {
                userName: formValues.username,
                email: formValues.email,
                contact: formValues.contact,
                roleName: formValues.role.name,
                password: formValues.password,
            }

            registerUser(registerPayload)
        }
    }

    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-panel" style={{ justifyContent: "space-around" }}>
                    <div className="login-form">
                        <h2>Register</h2>
                        <p>
                            Already have an account? <a href="/">Login</a>
                        </p>
                        {loading ? <Loader content="Loading Form" /> : <Form submitText='Register' schema={registerSchema} submit={getData} cancel={goToLogin} />}
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

export default Register