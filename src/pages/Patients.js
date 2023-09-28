import React, { useState, useEffect, useRef } from 'react';
import Table from '../components/GenericComponents/Table';
import Header from '../components/GenericComponents/Header';
import Modal from '../components/GenericComponents/Modal'
import Form from '../components/GenericComponents/Form';
import { validateEmail } from '../components/GenericComponents/Validations';
import APICaller from '../components/GenericComponents/APICaller';
import Loader from '../components/GenericComponents/Loader';
import Button from '../components/GenericComponents/Button'
import Toast from '../components/GenericComponents/Toast';
import SureDialog from '../components/GenericComponents/SureDialog';
import { checkLoggedInUser } from '../components/GenericComponents/Utilities';
const { REACT_APP_BASE_URL } = process.env

const Patients = (props) => {

    const [fetchPatientsResponse, setFetchPatientsResponse] = useState()
    const [loadingPatients, setLoadingPatients] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [ROWS, setRows] = useState([])
    const [createPatientResponse, setCreatePatientResponse] = useState()
    const [updatePatientResponse, setUpdatePatientResponse] = useState()
    const [deletePatientResponse, setDeletePatientResponse] = useState()
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [selectedPatient, setSelectedPatient] = useState({})
    const [modalHeader, setModalHeader] = useState('Create a Patient')
    const [sureDelete, setSureDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (props.calledFromModal) {
            setShowCreate(true)
            //props.modalState(showCreate)
        }
    }, [])

    useEffect(() => {
        setLoadingPatients(true)
        fetchPatients()
    }, [])

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        if (fetchPatientsResponse) {
            if (fetchPatientsResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingPatients(false)
                    toastSetting('error', fetchPatientsResponse.message, 'Failed to fetch Patients.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customRows = cleanData(fetchPatientsResponse)
                setRows(customRows)
                setTimeout(() => {
                    setLoadingPatients(false)
                }, 500)
            }

            setSelectedPatient({})
        }
    }, [fetchPatientsResponse])

    useEffect(() => {
        if (createPatientResponse) {
            if (createPatientResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingPatients(false)
                    closeCreateModal()
                    toastSetting('error', createPatientResponse.message, 'Failed to create a Patient.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Patient has been created successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingPatients(true)
                    fetchPatients()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedPatient({})
        }
    }, [createPatientResponse])

    useEffect(() => {
        if (updatePatientResponse) {
            if (updatePatientResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingPatients(false)
                    closeCreateModal()
                    toastSetting('error', updatePatientResponse.message, 'Failed to update the Patient.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Patient has been updated successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingPatients(true)
                    fetchPatients()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedPatient({})
        }
    }, [updatePatientResponse])

    useEffect(() => {
        if (deletePatientResponse) {
            if (deletePatientResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    setLoadingPatients(false)
                    toastSetting('error', deletePatientResponse.message, 'Failed to delete the Patient.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    toastSetting('success', 'Success', 'Patient has been deleted successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingPatients(true)
                    fetchPatients()
                    toastSetting('', '', '', false)
                }, 3000)
            }

            setSelectedPatient({})
        }
    }, [deletePatientResponse])

    const cleanData = (rows) => {
        let newRows = []

        rows.map((item) => {
            let newItem = { ...item, name: item.firstname + ' ' + item.lastname }
            newRows.push(newItem)
        })

        return newRows
    }

    const fetchPatients = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Patient/get`,
            type: 'get'
        }

        checkLoggedInUser()
        let PatientsResponse = await APICaller(request)
        setFetchPatientsResponse(PatientsResponse)
    }

    const createPatient = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Patient/Create`,
            type: 'post',
            payload: data
        }

        checkLoggedInUser()
        let createPa = await APICaller(request)
        setCreatePatientResponse(createPa)
    }

    const updatePatient = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Patient/Update`,
            type: 'post',
            payload: data
        }

        checkLoggedInUser()
        let updatePa = await APICaller(request)
        setUpdatePatientResponse(updatePa)
    }

    const removePatient = async () => {
        setDeleting(true)

        const request = {
            url: `${REACT_APP_BASE_URL}/Patient/Delete`,
            type: 'post',
            payload: { id: selectedPatient.id }
        }

        checkLoggedInUser()
        let deletePa = await APICaller(request)
        setDeletePatientResponse(deletePa)
    }

    const patientSchema = [
        {
            div: [
                { type: 'text', name: 'firstname', label: 'First Name', placeholder: 'First Name', icon: 'user', required: true },
                { type: 'text', name: 'lastname', label: 'Last Name', icon: 'user' },
            ]
        },
        {
            div: [
                { type: 'number', name: 'contact', label: 'Contact', placeholder: 'Contact #', icon: 'mobile', required: true },
                { type: 'text', name: 'email', label: 'Email', placeholder: 'Email', icon: 'envelope', validation: validateEmail },
            ]
        },
        {
            div: [
                { type: 'multiline', name: 'address', placeholder: 'Address', icon: 'map' }
            ]
        },
        {
            div: [
                { type: 'date', name: 'dob', label: 'Date of birth', placeholder: 'DOB', min: new Date("01/01/1940"), max: new Date() },
                { type: 'text', name: 'city', label: 'City', placeholder: 'City' },
                { type: 'text', name: 'country', label: 'Country', placeholder: 'Country' },
            ]
        }
    ]

    const editPatient = (rowData) => {
        setSelectedPatient(rowData)
        setModalHeader('Edit a Patient')
        openCreateModal()
    }

    const deletePatient = (rowData) => {
        setSelectedPatient(rowData)
        setSureDelete(true)
    }

    const getActions = (rowData) => {
        return <div>
            <Button onButtonClick={() => editPatient(rowData)} label="Edit" className="mr-2"></Button>
            <Button customStyle={{ background: 'red', border: '1px solid red' }} onButtonClick={() => deletePatient(rowData)} label="Delete" className="mr-2"></Button>
        </div>
    }

    const COLUMNS = [
        {
            field: 'name',
            header: 'Name',
            sortable: false,
            filter: true,
        },
        {
            field: 'city',
            header: 'City',
            sortable: true,
            filter: false
        },
        {
            field: 'contact',
            header: 'Contact',
            sortable: true,
            filter: true
        },
        {
            field: 'action',
            header: 'Actions',
            sortable: false,
            filter: false,
            body: getActions
        },
    ]

    const openCreateModal = () => {
        setShowCreate(true)
    }

    const closeCreateModal = () => {
        setShowCreate(false)
        setSelectedPatient({})

        setTimeout(() => {
            setModalHeader('Create a Patient')
        }, 2000)

        if (props.calledFromModal) {
            props.modalState(showCreate)
        }
    }

    const getData = (data) => {
        if (Object.keys(selectedPatient).length) {
            let newData = { ...data, id: selectedPatient.id }
            updatePatient(newData)
        } else {
            createPatient(data)
        }
    }

    return <div>
        {props.calledFromModal ? <Form schema={patientSchema} submit={getData} cancel={closeCreateModal} /> :
            <div>
                <Header createClick={openCreateModal} create />
                {sureDelete && <SureDialog loading={deleting} content={'Are you sure you want to delete this Patient?'} yes={removePatient} no={() => setSureDelete(false)} />}
                {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
                <Modal content={<Form schema={patientSchema} submit={getData} cancel={closeCreateModal} selected={selectedPatient} />} header={modalHeader} show={showCreate} hide={closeCreateModal} />
                {loadingPatients ? <Loader content={'Fetching Patients'} /> : <Table rows={ROWS} columns={COLUMNS} />}
            </div>}
    </div>
}

export default Patients