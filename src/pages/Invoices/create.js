import React, { useState, useEffect, useRef } from 'react';
import Form from '../../components/GenericComponents/Form';
//import { validateEmail } from '../../components/GenericComponents/Validations';
import CreateDoctor from '../Doctors'
import CreatePatient from '../Patients'
import Modal from '../../components/GenericComponents/Modal'
import Procedures from '../Invoices/add_procedures';
import APICaller from '../../components/GenericComponents/APICaller';
import Toast from '../../components/GenericComponents/Toast';
import { checkLoggedInUser } from '../../components/GenericComponents/Utilities';
const { REACT_APP_BASE_URL } = process.env

const CreateInvoice = () => {

    const [showCreate, setShowCreate] = useState(false)
    const [createContent, setCreateContent] = useState('')
    const [createHeader, setCreateHeader] = useState('')
    const [proceduresData, setProceduresData] = useState({
        procedures: [],
        amount: {},
        medicationNotes: '',
        specialNotes: ''
    })
    const [doctorsResponse, setDoctorsResponse] = useState()
    const [doctorsOptions, setDoctorsOptions] = useState([])
    const [patientsResponse, setPatientsResponse] = useState()
    const [patientsOptions, setPatientsOptions] = useState([])
    const [createInvoiceResponse, setCreateInvoiceResponse] = useState()
    //const [loadingForm, setLoadingForm] = useState(true)
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        fetchDoctors()
        fetchPatients()
    }, [])

    useEffect(() => {
        if (doctorsResponse) {
            if (doctorsResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', doctorsResponse.message, 'Failed to fetch Doctors.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customDoctors = []
                doctorsResponse.map((item) => {
                    let newObject = {
                        name: item.firstname + ' ' + item.lastname,
                        code: item.id
                    }
                    customDoctors.push(newObject)
                })

                setDoctorsOptions(customDoctors)

                // setTimeout(() => {
                //     setLoadingForm(false)
                // }, 3000)
            }
        }
    }, [doctorsResponse])

    useEffect(() => {
        if (patientsResponse) {
            if (patientsResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', patientsResponse.message, 'Failed to fetch Patients.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customPatients = []
                patientsResponse.map((item) => {
                    let newObject = {
                        name: item.firstname + ' ' + item.lastname,
                        code: item.id
                    }
                    customPatients.push(newObject)
                })

                setPatientsOptions(customPatients)

                // setTimeout(() => {
                //     setLoadingForm(false)
                // }, 3000)
            }
        }
    }, [patientsResponse])

    useEffect(() => {
        if (createInvoiceResponse) {
            if (createInvoiceResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    localStorage.removeItem('formSubmit')
                    toastSetting('error', createInvoiceResponse.message, 'Failed to create an Invoice.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    localStorage.removeItem('formSubmit')
                    toastSetting('success', 'Success', 'Invoice has been created successfully.', true)
                }, 1000)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                    window.location.href = './#/invoices'
                }, 3000)
            }
        }
    }, [createInvoiceResponse])

    const fetchDoctors = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Doctor/get`,
            type: 'get'
        }

        checkLoggedInUser()
        let doctorsResponse = await APICaller(request)
        setDoctorsResponse(doctorsResponse)
    }

    const fetchPatients = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Patient/get`,
            type: 'get'
        }

        checkLoggedInUser()
        let patientsResponse = await APICaller(request)
        setPatientsResponse(patientsResponse)
    }

    const createInvoice = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Invoice/Create`,
            type: 'post',
            payload: data
        }

        checkLoggedInUser()
        let createInvoiceResponse = await APICaller(request)
        setCreateInvoiceResponse(createInvoiceResponse)
    }

    const getModalState = (value) => {
        setShowCreate(false)

        if (localStorage.getItem('formSubmit')) {
            setToastHeader('Success')
            setToastType('success')
            setToastStatus(true)

            setTimeout(() => {
                setToastHeader('')
                setToastType('')
                setToastStatus(false)
                //setLoadingForm(true)
                fetchDoctors()
                fetchPatients()
            }, 3000)
        }
    }

    const createDoctor = () => {
        setCreateHeader('Create Doctor')
        setToastMessage('Doctor has been created successfully.')
        setCreateContent(<CreateDoctor calledFromModal modalState={getModalState} />)
        setShowCreate(true)
    }

    const createPatient = () => {
        setCreateHeader('Create Patient')
        setToastMessage('Patient has been created successfully.')
        setCreateContent(<CreatePatient calledFromModal modalState={getModalState} />)
        setShowCreate(true)
    }

    const getProceduresData = (value) => {
        let key = Object.keys(value)[0]
        let newProceduresData = proceduresData

        setProceduresData({
            ...newProceduresData,
            [key]: value[key]
        })
    }

    const invoiceSchema = [
        {
            div: [
                { type: 'select', name: 'doctor', label: 'Doctor', placeholder: 'Select a Doctor', options: doctorsOptions, optionName: 'name', required: true, searchable: true, create: true, createFunction: createDoctor, refreshFunction: fetchDoctors },
                { type: 'select', name: 'patient', label: 'Patient', placeholder: 'Select a Patient', options: patientsOptions, optionName: 'name', required: true, searchable: true, create: true, createFunction: createPatient, refreshFunction: fetchPatients },
                { type: 'date', name: 'invoice_date', label: 'Date', placeholder: 'Date' }
            ]
        },
        {
            div: [
                { type: 'component', name: 'procedures', component: <Procedures data={getProceduresData} /> }
            ]
        },

    ]

    const getData = (data) => {
        if (!proceduresData.amount.cashReceived.length) {
            toastSetting('error', 'Error', 'Cash received cannot be empty', true)

            setTimeout(() => {
                toastSetting('', '', '', false)
                localStorage.removeItem('formSubmit')
            }, 3000)
        } else {
            const customProcedures = []
            proceduresData.procedures.map((item) => {
                let procedureObject = {
                    procedureId: item.procedure_name.code,
                    qty: item.procedure_qty,
                    price: item.procedure_price,
                    procedureNotes: JSON.stringify(item.notes)
                }

                customProcedures.push(procedureObject)
            })

            const invoicePayload = {
                patientId: data.patient.code,
                doctorId: data.doctor.code,
                createdDate: data.invoice_date,
                totalAmount: proceduresData.amount.originalTotal,
                discount: parseInt(proceduresData.amount.discount),
                netPayable: proceduresData.amount.netPayable,
                paidAmount: parseInt(proceduresData.amount.cashReceived),
                dueAmount: parseInt(proceduresData.amount.paymentDue),
                invoiceStatus: "true",
                notes: proceduresData.medicationNotes,
                additionalNotes: proceduresData.specialNotes,
                invoiceDetails: customProcedures
            }

            createInvoice(invoicePayload)
        }
    }

    const closeCreateModal = () => {
        setShowCreate(false)
    }

    const goToInvoices = () => {
        window.location.href = './#/invoices'
    }

    // return <div>
    //     {loadingForm ? <Loader content={'Loading Form'} /> : <div>
    //         {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
    //         <Form schema={invoiceSchema} submit={getData} cancel={goToInvoices} />
    //         <Modal header={createHeader} content={createContent} show={showCreate} hide={closeCreateModal} />
    //     </div>}
    // </div>

    return <div>
        {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
        <Form schema={invoiceSchema} submit={getData} cancel={goToInvoices} />
        <Modal header={createHeader} content={createContent} show={showCreate} hide={closeCreateModal} />
    </div>
}

export default CreateInvoice