import React, { useState, useEffect, useRef } from 'react';
import Table from '../../components/GenericComponents/Table'
import Header from '../../components/GenericComponents/Header';
import Button from '../../components/GenericComponents/Button';
import Modal from '../../components/GenericComponents/Modal';
import Loader from '../../components/GenericComponents/Loader';
import Toast from '../../components/GenericComponents/Toast';
import APICaller from '../../components/GenericComponents/APICaller';
import SureDialog from '../../components/GenericComponents/SureDialog';
import { checkLoggedInUser } from '../../components/GenericComponents/Utilities';
const { REACT_APP_BASE_URL, REACT_APP_SECRET_KEY } = process.env

const Invoices = () => {

    const [showHistory, setShowHistory] = useState(false)
    const [fetchInvoicesResponse, setFetchInvoicesResponse] = useState()
    const [loadingInvoices, setLoadingInvoices] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState({})
    const [ROWS, setRows] = useState([])
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [invoiceRows, setInvoiceRows] = useState([])
    const [invoiceData, setInvoiceData] = useState()

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        setLoadingInvoices(true)
        fetchInvoices()
    }, [])

    useEffect(() => {
        if (fetchInvoicesResponse) {
            if (fetchInvoicesResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setLoadingInvoices(false)
                    toastSetting('error', fetchInvoicesResponse.message, 'Failed to fetch Invoices.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customRows = cleanData(fetchInvoicesResponse)
                setRows(customRows)
                setTimeout(() => {
                    setLoadingInvoices(false)
                }, 500)
            }

            setSelectedInvoice({})
        }
    }, [fetchInvoicesResponse])

    const cleanData = (rows) => {
        let newRows = []

        rows.map((item) => {
            let newItem = {
                ...item,
                doctorName: item.doctor.firstname + " " + item.doctor.lastname,
                patientName: item.patient.firstname + " " + item.patient.lastname,
                procedureName: item.invoiceDetails.map(x => x.procedure.name + ", "),
                createdDate: new Date(item.createdDate).toLocaleString("en-PK", { timeZone: "Australia/Brisbane", year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long", hour: '2-digit', hour12: true, minute: '2-digit', second: '2-digit' })
            }

            newRows.push(newItem)
        })

        return newRows
    }

    const fetchInvoices = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Invoice/getAll`,
            type: 'get'
        }

        checkLoggedInUser()
        let invoicesResponse = await APICaller(request)
        setFetchInvoicesResponse(invoicesResponse)
    }

    const viewHistory = (data) => {
        setInvoiceRows(data.invoiceHistory)
        setInvoiceData(data)
        setShowHistory(true)
    }

    const hashFunction = (invoiceID) => {
        let secretID = invoiceID * REACT_APP_SECRET_KEY * REACT_APP_SECRET_KEY
        return secretID
    }

    const updateInvoice = (data) => {
        let invoiceID = data.id
        window.location.href = `./#/invoices/update?ID=${hashFunction(invoiceID)}`
    }

    const printInvoice = (data) => {
        let invoiceID = data.id
        window.location.href = `./#/invoices/print?ID=${hashFunction(invoiceID)}`
    }

    const invoiceDetails = (rowData) => {
        return <div>
            <Button onButtonClick={() => viewHistory(rowData)} label="View Invoice History" className="mr-2"></Button>
            <Button onButtonClick={() => updateInvoice(rowData)} label="Update Invoice" className="mr-2"></Button>
            <Button onButtonClick={() => printInvoice(rowData)} label="Print Invoice" className="mr-2"></Button>
        </div>
    }

    const COLUMNS = [
        {
            field: 'patientName',
            header: 'Patient',
            sortable: false,
            filter: true
        },
        {
            field: 'doctorName',
            header: 'Doctor',
            sortable: true,
            filter: false
        },
        
        {
            field: 'procedureName',
            header: 'Procedure',
            sortable: true,
            filter: true
        },
        {
            field: 'createdDate',
            header: 'Invoice Date',
            sortable: true,
            filter: true
        },
        {
            field: 'action',
            header: 'Action',
            body: invoiceDetails,
            sortable: false,
            filter: false
        },
    ]

    const getInvoiceIndex = (rowData, index) => {
        return index.rowIndex + 1
    }

    const getInvoiceDate = (rowData) => {
        return new Date(rowData.createdDate).toLocaleString("en-PK", { timeZone: "Australia/Brisbane", year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long", hour: '2-digit', hour12: true, minute: '2-digit', second: '2-digit' }) 
    }

    const getPaidAmount = (rowData) => {
        if(rowData.balance == 0) {
            const previousInvoice = invoiceRows.filter((item) => {
                return item.id == rowData.id - 1
            })

            return previousInvoice[0].balance
        } else {
            return rowData.paidAmount
        }
    }

    const getTotalPaid = (rowData) => {
        if(rowData.balance == 0) {
            return invoiceData?.netPayable
        } else {
            return rowData.totalPaid
        }
    }

    const INVOICE_COLUMNS = [
        {
            header: 'Payment #',
            body: getInvoiceIndex,
            width: '10'
            // sortable: false,
            // filter: true
        },
        {
            field: 'createdDate',
            header: 'Date',
            // sortable: true,
            // filter: false
            body: getInvoiceDate
        },
        {
            field: 'paidAmount',
            header: 'Paid Amount (PKR)',
            body: getPaidAmount
            // sortable: true,
            // filter: false
        },
        {
            field: 'totalPaid',
            header: 'Total Paid (PKR)',
            body: getTotalPaid
            // sortable: true,
            // filter: true
        },
        {
            field: 'balance',
            header: 'Payment Due (PKR)',
            // sortable: true,
            // filter: true
        },
    ]

    const goToCreate = () => {
        window.location.href = './#/invoices/create'
    }

    const closeHistoryModal = () => {
        setShowHistory(false)
    }

    const historyContent = () => {
        return <div>
            <strong>Total Amount (PKR): </strong>{invoiceData?.totalAmount}<br /><br />
            <strong>Discount (PKR): </strong>{invoiceData?.discount}<br /><br />
            <strong>Net Payable (PKR): </strong>{invoiceData?.netPayable}<br /><br />
            <Table rows={invoiceRows} columns={INVOICE_COLUMNS} rowsPerPage={5} />
        </div>
        //filterHistory
    }

    return <div>
        <Header createClick={goToCreate} create />
        {/* {sureDelete && <SureDialog loading={deleting} content={'Are you sure you want to delete this Invoice?'} yes={removeDoctor} no={() => setSureDelete(false)} />} */}
        {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
        {loadingInvoices ? <Loader content={'Fetching Invoices'} /> : <Table rows={ROWS} columns={COLUMNS} />}
        <Modal content={historyContent()} header={'Invoice History'} show={showHistory} hide={closeHistoryModal} />
    </div>
}

export default Invoices