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

const Procedures = (props) => {

    const [fetchProceduresResponse, setFetchProceduresResponse] = useState()
    const [loadingProcedures, setLoadingProcedures] = useState(false)
    const [showCreate, setShowCreate] = useState(false)
    const [ROWS, setRows] = useState([])
    const [createProcedureResponse, setCreateProcedureResponse] = useState()
    const [updateProcedureResponse, setUpdateProcedureResponse] = useState()
    const [deleteProcedureResponse, setDeleteProcedureResponse] = useState()
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [selectedProcedure, setSelectedProcedure] = useState({})
    const [modalHeader, setModalHeader] = useState('Create a Procedure')
    const [sureDelete, setSureDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (props.calledFromModal) {
            setShowCreate(true)
            //props.modalState(showCreate)
        }
    }, [])

    useEffect(() => {
        setLoadingProcedures(true)
        fetchProcedures()
    }, [])

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        if (fetchProceduresResponse) {
            if (fetchProceduresResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingProcedures(false)
                    toastSetting('error', fetchProceduresResponse.message, 'Failed to fetch Procedures.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setRows(fetchProceduresResponse)
                setTimeout(() => {
                    setLoadingProcedures(false)
                }, 500)
            }

            setSelectedProcedure({})
        }
    }, [fetchProceduresResponse])

    useEffect(() => {
        if (createProcedureResponse) {
            if (createProcedureResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingProcedures(false)
                    closeCreateModal()
                    toastSetting('error', createProcedureResponse.message, 'Failed to create a Procedure.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Procedure has been created successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingProcedures(true)
                    fetchProcedures()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedProcedure({})
        }
    }, [createProcedureResponse])

    useEffect(() => {
        if (updateProcedureResponse) {
            if (updateProcedureResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingProcedures(false)
                    closeCreateModal()
                    toastSetting('error', updateProcedureResponse.message, 'Failed to update the Procedure.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    closeCreateModal()
                    localStorage.setItem('formSubmit', false)
                    toastSetting('success', 'Success', 'Procedure has been updated successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingProcedures(true)
                    fetchProcedures()
                    toastSetting('', '', '', false)
                    localStorage.removeItem('formSubmit')
                }, 3000)
            }

            setSelectedProcedure({})
        }
    }, [updateProcedureResponse])

    useEffect(() => {
        if (deleteProcedureResponse) {
            if (deleteProcedureResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    setLoadingProcedures(false)
                    toastSetting('error', deleteProcedureResponse.message, 'Failed to delete the Procedure.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    setDeleting(false)
                    setSureDelete(false)
                    toastSetting('success', 'Success', 'Procedure has been deleted successfully.', true)
                }, 1000)

                setTimeout(() => {
                    setLoadingProcedures(true)
                    fetchProcedures()
                    toastSetting('', '', '', false)
                }, 3000)
            }

            setSelectedProcedure({})
        }
    }, [deleteProcedureResponse])

    const fetchProcedures = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Procedure/getAll`,
            type: 'get'
        }

        checkLoggedInUser()
        let ProceduresResponse = await APICaller(request)
        setFetchProceduresResponse(ProceduresResponse)
    }

    const createProcedure = async (data) => {
        let customPayload = data
        customPayload = {...data, tax: 0, defaultUnit: "0" }

        const request = {
            url: `${REACT_APP_BASE_URL}/Procedure/Create`,
            type: 'post',
            payload: customPayload
        }

        checkLoggedInUser()
        let createPr = await APICaller(request)
        setCreateProcedureResponse(createPr)
    }

    const updateProcedure = async (data) => {
        let customPayload = data
        customPayload = {...data, tax: 0, defaultUnit: "0" }

        const request = {
            url: `${REACT_APP_BASE_URL}/Procedure/Update`,
            type: 'post',
            payload: customPayload
        }

        checkLoggedInUser()
        let updatePr = await APICaller(request)
        setUpdateProcedureResponse(updatePr)
    }

    const removeProcedure = async () => {
        setDeleting(true)

        const request = {
            url: `${REACT_APP_BASE_URL}/Procedure/Delete`,
            type: 'post',
            payload: { id: selectedProcedure.id }
        }

        checkLoggedInUser()
        let deletePr = await APICaller(request)
        setDeleteProcedureResponse(deletePr)
    }

    const ProcedureSchema = [
        {
            div: [
                { type: 'text', name: 'name', label: 'Procedure Name', placeholder: 'Procedure Name', required: true },
                { type: 'number', name: 'price', label: 'Procedure Price', placeholder: 'Procedure Price (PKR)', required: true }
            ]
        },
        {
            div: [
                { type: 'multiline', name: 'description', label: 'Procedure Description', placeholder: 'Procedure Description', required: true },
            ]
        },
    ]

    const editProcedure = (rowData) => {
        setSelectedProcedure(rowData)
        setModalHeader('Edit a Procedure')
        openCreateModal()
    }

    const deleteProcedure = (rowData) => {
        setSelectedProcedure(rowData)
        setSureDelete(true)
    }

    const getActions = (rowData) => {
        return <div>
            <Button onButtonClick={() => editProcedure(rowData)} label="Edit" className="mr-2"></Button>
            <Button customStyle={{ background: 'red', border: '1px solid red' }} onButtonClick={() => deleteProcedure(rowData)} label="Delete" className="mr-2"></Button>
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
            field: 'description',
            header: 'Descripiton',
            sortable: true,
            width: '500px',
            filter: false
        },
        {
            field: 'price',
            header: 'Price',
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
        setSelectedProcedure({})

        setTimeout(() => {
            setModalHeader('Create a Procedure')
        }, 2000)

        if (props.calledFromModal) {
            props.modalState(showCreate)
        }
    }

    const getData = (data) => {
        if (Object.keys(selectedProcedure).length) {
            let newData = { ...data, id: selectedProcedure.id }
            updateProcedure(newData)
        } else {
            createProcedure(data)
        }
    }

    return <div>
        {props.calledFromModal ? <Form schema={ProcedureSchema} submit={getData} cancel={closeCreateModal} /> :
            <div>
                <Header createClick={openCreateModal} create />
                {sureDelete && <SureDialog loading={deleting} content={'Are you sure you want to delete this Procedure?'} yes={removeProcedure} no={() => setSureDelete(false)} />}
                {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
                <Modal content={<Form schema={ProcedureSchema} submit={getData} cancel={closeCreateModal} selected={selectedProcedure} />} header={modalHeader} show={showCreate} hide={closeCreateModal} />
                {loadingProcedures ? <Loader content={'Fetching Procedures'} /> : <Table rows={ROWS} columns={COLUMNS} />}
            </div>}
    </div>
}

export default Procedures