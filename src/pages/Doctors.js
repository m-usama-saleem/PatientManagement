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

const Doctors = (props) => {

    const [fetchDoctorsResponse, setFetchDoctorsResponse] = useState()
    const [loadingDoctors, setLoadingDoctors] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [ROWS, setRows] = useState([])
    const [createDoctorResponse, setCreateDoctorResponse] = useState()
    const [updateDoctorResponse, setUpdateDoctorResponse] = useState()
    const [deleteDoctorResponse, setDeleteDoctorResponse] = useState()
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState({})
    const [modalHeader, setModalHeader] = useState('Create a Doctor')
    const [sureDelete, setSureDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (props.calledFromModal) {
            setShowCreate(true)
            //props.modalState(showCreate)
        }
    }, [])

    useEffect(() => {
        setLoadingDoctors(true)
        fetchDoctors()
    }, [])

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        if (fetchDoctorsResponse) {
            if (fetchDoctorsResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingDoctors(false)
                    toastSetting('error', fetchDoctorsResponse.message, 'Failed to fetch Doctors.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customRows = cleanData(fetchDoctorsResponse)
                setRows(customRows)
                setTimeout(() => {
                    setLoadingDoctors(false)
                }, 500)
            }

            setSelectedDoctor({})
        }
    }, [fetchDoctorsResponse])

    useEffect(() => {
        if (createDoctorResponse) {
            if (createDoctorResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingDoctors(false)
                    closeCreateModal()
                    toastSetting('error', createDoctorResponse.message, 'Failed to create a Doctor.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Doctor has been created successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingDoctors(true)
                    fetchDoctors()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedDoctor({})
        }
    }, [createDoctorResponse])

    useEffect(() => {
        if (updateDoctorResponse) {
            if (updateDoctorResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingDoctors(false)
                    closeCreateModal()
                    toastSetting('error', updateDoctorResponse.message, 'Failed to update the Doctor.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Doctor has been updated successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingDoctors(true)
                    fetchDoctors()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedDoctor({})
        }
    }, [updateDoctorResponse])

    useEffect(() => {
        if (deleteDoctorResponse) {
            if (deleteDoctorResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    setLoadingDoctors(false)
                    toastSetting('error', deleteDoctorResponse.message, 'Failed to delete the Doctor.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    toastSetting('success', 'Success', 'Doctor has been deleted successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingDoctors(true)
                    fetchDoctors()
                    toastSetting('', '', '', false)
                }, 3000)
            }

            setSelectedDoctor({})
        }
    }, [deleteDoctorResponse])

    const cleanData = (rows) => {
        let newRows = []

        rows.map((item) => {
            let newItem = { ...item, name: item.firstname + ' ' + item.lastname }
            newRows.push(newItem)
        })

        return newRows
    }

    const fetchDoctors = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Doctor/get`,
            type: 'get'
        }

        checkLoggedInUser()
        let doctorsResponse = await APICaller(request)
        setFetchDoctorsResponse(doctorsResponse)
    }

    const createDoctor = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Doctor/Create`,
            type: 'post',
            payload: data
        }

        checkLoggedInUser()
        let createDr = await APICaller(request)
        setCreateDoctorResponse(createDr)
    }

    const updateDoctor = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Doctor/Update`,
            type: 'post',
            payload: data
        }

        checkLoggedInUser()
        let updateDr = await APICaller(request)
        setUpdateDoctorResponse(updateDr)
    }

    const removeDoctor = async () => {
        setDeleting(true)

        const request = {
            url: `${REACT_APP_BASE_URL}/Doctor/Delete`,
            type: 'post',
            payload: { id: selectedDoctor.id }
        }

        checkLoggedInUser()
        let deleteDr = await APICaller(request)
        setDeleteDoctorResponse(deleteDr)
    }

    const doctorSchema = [
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
                { type: 'multiline', name: 'address', placeholder: 'Address', icon: 'map' },
            ]
        },
        {
            div: [
                { name: 'designation', label: 'Designation', placeholder: 'Designation' },
                { type: 'text', name: 'city', label: 'City', placeholder: 'City' },
                { type: 'text', name: 'country', label: 'Country', placeholder: 'Country' },
            ]
        }
    ]

    const editDoctor = (rowData) => {
        setSelectedDoctor(rowData)
        setModalHeader('Edit a Doctor')
        openCreateModal()
    }

    const deleteDoctor = (rowData) => {
        setSelectedDoctor(rowData)
        setSureDelete(true)
    }

    const getActions = (rowData) => {
        return <div>
            <Button onButtonClick={() => editDoctor(rowData)} label="Edit" className="mr-2"></Button>
            <Button customStyle={{ background: 'red', border: '1px solid red' }} onButtonClick={() => deleteDoctor(rowData)} label="Delete" className="mr-2"></Button>
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
        setSelectedDoctor({})

        setTimeout(() => {
            setModalHeader('Create a Doctor')
        }, 2000)

        if (props.calledFromModal) {
            props.modalState(showCreate)
        }
    }

    const getData = (data) => {
        if (Object.keys(selectedDoctor).length) {
            let newData = { ...data, id: selectedDoctor.id }
            updateDoctor(newData)
        } else {
            createDoctor(data)
        }
    }

    return <div>
        {props.calledFromModal ? <Form schema={doctorSchema} submit={getData} cancel={closeCreateModal} /> :
            <div>
                <Header createClick={openCreateModal} create />
                {sureDelete && <SureDialog loading={deleting} content={'Are you sure you want to delete this doctor?'} yes={removeDoctor} no={() => setSureDelete(false)} />}
                {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
                <Modal content={<Form schema={doctorSchema} submit={getData} cancel={closeCreateModal} selected={selectedDoctor} />} header={modalHeader} show={showCreate} hide={closeCreateModal} />
                {loadingDoctors ? <Loader content={'Fetching Doctors'} /> : <Table rows={ROWS} columns={COLUMNS} />}
            </div>}
    </div>
}

export default Doctors