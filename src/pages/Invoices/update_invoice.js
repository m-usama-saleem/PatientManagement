import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/GenericComponents/Header';
import Modal from '../../components/GenericComponents/Modal'
import APICaller from '../../components/GenericComponents/APICaller';
import Toast from '../../components/GenericComponents/Toast';
import TextField from '../../components/GenericComponents/TextField';
import { Button } from 'primereact/button';
import MultilineField from '../../components/GenericComponents/MultilineField';
import ProceduralNotes from './add_procedural_notes';
import Loader from '../../components/GenericComponents/Loader';
import { checkLoggedInUser } from '../../components/GenericComponents/Utilities';
import DateField from '../../components/GenericComponents/DateField';
const { REACT_APP_BASE_URL, REACT_APP_SECRET_KEY } = process.env

const UpdateInvoice = () => {
    const [procedures, setProcedures] = useState([{
        procedure_name: {},
        procedure_description: '',
        procedure_qty: '',
        procedure_price: '',
        notes: []
    }])

    const [disabledAdd, setDisabledAdd] = useState(true)
    const [loader, setLoader] = useState(true)
    const [loaderContent, setLoaderContent] = useState('')
    const [amount, setAmount] = useState({
        total: 0,
        orginalTotal: 0,
        discount: 0,
        netPayable: 0,
        cashReceived: 0,
        originalPaymentDue: 0,
        paymentDue: 0,
        cashbackDue: 0
    })

    const [showAddProcedures, setShowAddProcedures] = useState(false)
    const [selectedProcedure, setSelectedProcedure] = useState(false)
    const [position, setPosition] = useState(0)
    const [medicationNotes, setMedicationNotes] = useState('')
    const [specialNotes, setSpecialNotes] = useState('')
    const [showCreate, setShowCreate] = useState(false)
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [proceduresResponse, setProceduresResponse] = useState()
    const [proceduresOptions, setProceduresOptions] = useState([])
    const [invoiceDetailsResponse, setInvoiceDetailsResponse] = useState()
    const [invoiceDetails, setInvoiceDetails] = useState()
    const [lastInvoiceHistory, setLastInvoiceHistory] = useState()
    const [savePaymentResponse, setSavePaymentResponse] = useState()
    const [savePaymentLoad, setSavePaymentLoad] = useState(false)
    const [values, setValues] = useState()
    const [invoiceDate, setInvoiceDate] = useState()
    const [invoiceDateSchema, setInvoiceDateSchema] = useState()

    useEffect(() => {
        fetchProcedures()
    }, [])

    useEffect(() => {
        let invoiceID = parseInt(window.location.href.split('=')[1] / REACT_APP_SECRET_KEY / REACT_APP_SECRET_KEY)

        setLoader(true)
        fetchInvoiceDetails(invoiceID)
    }, [])

    useEffect(() => {
        if (invoiceDetailsResponse) {
            if (invoiceDetailsResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', invoiceDetailsResponse.message, 'Failed to fetch Invoice Details.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                    setLoader(false)
                }, 3000)
            } else {
                setInvoiceDetails(invoiceDetailsResponse)
                extractProcedures(invoiceDetailsResponse.invoiceDetails)
                setMedicationNotes(invoiceDetails?.notes)
                setSpecialNotes(invoiceDetails?.additionalNotes)
                setLastInvoiceHistory(invoiceDetailsResponse.invoiceHistory[invoiceDetailsResponse.invoiceHistory.length - 1])

                setTimeout(() => {
                    setAmount({
                        ...amount,
                        originalPaymentDue: lastInvoiceHistory?.balance,
                        paymentDue: lastInvoiceHistory?.balance
                    })
                    setInvoiceDateSchema(
                        {
                            type: "date",
                            name: "invoice_date",
                            label: "Payment Date",
                            placeholder: "Date",
                            required: false,
                            validated: true,
                            index: null,
                            onChange: getUpdatedValue,
                            defaultValue: invoiceDetails?.createdDate
                        })
                }, 3000)
                setTimeout(() => {
                    setLoader(false)
                }, 3000)
            }
        }
    }, [invoiceDetailsResponse])

    useEffect(() => {
        if (savePaymentResponse) {
            if (savePaymentResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    setSavePaymentLoad(false)
                    toastSetting('error', savePaymentResponse.message, 'Failed to update the payment.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                setTimeout(() => {
                    setSavePaymentLoad(false)
                    toastSetting('success', 'Success', 'Payment has been updated successfully.', true)
                }, 1000)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                    setSavePaymentLoad(false)
                    window.location.href = './#/invoices'
                }, 3000)
            }
        }
    }, [savePaymentResponse])

    const getUpdatedValue = (value) => {
        setInvoiceDate({value})
    }

    const extractProcedures = (existingProcedures) => {
        let procedures = []

        existingProcedures.map((item) => {
            let procedureObject = {
                procedure_name: item.procedure.name,
                procedure_description: item.procedure.description,
                procedure_qty: item.qty,
                procedure_price: item.price,
                notes: JSON.parse(item.procedureNotes)
            }

            procedures.push(procedureObject)
        })

        setProcedures(procedures)
    }

    const fetchInvoiceDetails = async (ID) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Invoice?id=${ID}`,
            type: 'get'
        }

        checkLoggedInUser()
        let invoiceDetailsResponse = await APICaller(request)
        setInvoiceDetailsResponse(invoiceDetailsResponse)
    }

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
    }

    useEffect(() => {
        if (proceduresResponse) {
            if (proceduresResponse.hasOwnProperty('code')) {
                setTimeout(() => {
                    toastSetting('error', proceduresResponse.message, 'Failed to fetch Procedures.', true)
                }, 500)

                setTimeout(() => {
                    toastSetting('', '', '', false)
                }, 3000)
            } else {
                let customProcedures = []
                proceduresResponse.map((item) => {
                    let newObject = {
                        name: item.name,
                        code: item.id
                    }
                    customProcedures.push(newObject)
                })

                setProceduresOptions(customProcedures)

                // setTimeout(() => {
                //     setLoadingForm(false)
                // }, 3000)
            }
        }
    }, [proceduresResponse])

    const fetchProcedures = async () => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Procedure/getAll`,
            type: 'get'
        }

        checkLoggedInUser()
        let proceduresResponse = await APICaller(request)
        setProceduresResponse(proceduresResponse)
    }

    useEffect(() => {
        let newValues = values

        setValues({
            ...newValues,
            procuderes: procedures,
            amount: amount,
            medicationNotes: medicationNotes,
            specialNotes: specialNotes
        })

        //props.data(values)
    }, [amount, procedures, medicationNotes, specialNotes])

    const getValue = (value) => {
        let newProcedures = procedures
        newProcedures[value.index][value.fieldName] = value.fieldValue == null ? {} : value.fieldValue

        setProcedures(newProcedures)
        checkAdd()
    }

    const checkAdd = () => {
        if ((typeof procedures[procedures.length - 1].procedure_name == 'object') &&
            (Object.keys(procedures[procedures.length - 1].procedure_name).length) &&
            (procedures[procedures.length - 1].procedure_description.length) &&
            (procedures[procedures.length - 1].procedure_qty.length) &&
            (procedures[procedures.length - 1].procedure_price.length)) {
            setDisabledAdd(false)
        } else {
            setDisabledAdd(true)
        }
    }

    const createProcedure = () => {
        setToastMessage('Procedure has been created successfully.')
        setShowCreate(true)
    }

    const procedureNameAttributes = {
        name: 'procedure_name',
        placeholder: 'Procedure Name',
        options: proceduresOptions,
        optionName: 'name',
        searchable: true,
        create: true,
        createFunction: createProcedure,
        refreshFunction: fetchProcedures,
        onChange: getValue
    }

    const procedureDescriptionAttributes = {
        rows: '1',
        name: 'procedure_description',
        placeholder: 'Procedure Description',
        onChange: getValue
    }

    const procedureQtyAttributes = {
        type: 'number',
        name: 'procedure_qty',
        min: '1',
        placeholder: 'Procedure Qty.',
        onChange: getValue
    }

    const procedurePriceAttributes = {
        type: 'number',
        name: 'procedure_price',
        min: '0',
        placeholder: 'Procedure Price',
        onChange: getValue
    }

    const getMedicationNotes = (value) => {
        setMedicationNotes(value.fieldValue)
    }

    const getSpecialNotes = (value) => {
        setSpecialNotes(value.fieldValue)
    }

    const getDiscount = (value) => {
        let newAmount = 0

        if (!value.fieldValue.length) {
            newAmount = amount.orginalTotal
        } else {
            newAmount = amount.orginalTotal - parseInt(value.fieldValue)
        }

        setAmount({
            ...amount,
            discount: value.fieldValue,
            total: newAmount,
            netPayable: newAmount,
            originalPaymentDue: newAmount,
            paymentDue: newAmount
        })
    }

    const getCashReceived = (value) => {
        let newAmount = 0
        let newCashback = 0

        if (!value.fieldValue.length) {
            newAmount = amount.originalPaymentDue
            newCashback = '0'
        } else {
            newAmount = amount.originalPaymentDue - parseInt(value.fieldValue)

            if (newAmount == 0) {
                newAmount = '0'
            } else if (newAmount < 0) {
                newCashback = newAmount * (-1)
                newAmount = '0'
            }

            if (newCashback == 0) {
                newCashback = '0'
            }
        }

        setAmount({
            ...amount,
            cashReceived: value.fieldValue,
            paymentDue: newAmount,
            cashbackDue: newCashback
        })
    }

    const medicationNotesAttributes = {
        name: 'medication_notes',
        rows: 5,
        value: medicationNotes,
        onChange: getMedicationNotes
    }

    const specialNotesAttributes = {
        name: 'special_notes',
        rows: 5,
        value: specialNotes,
        onChange: getSpecialNotes
    }

    const totalAttributes = {
        type: 'number',
        name: 'total',
        width: '100px',
        inline: true,
        min: '0',
        label: <b>Total</b>,
        disabled: true,
        defValue: invoiceDetails?.totalAmount
    }

    const netPayableAttributes = {
        type: 'number',
        name: 'net_payable',
        width: '100px',
        inline: true,
        min: '0',
        label: <b>Net Payable</b>,
        disabled: true,
        defValue: invoiceDetails?.netPayable
    }

    const paymentDueAttributes = {
        type: 'number',
        name: 'payment_due',
        width: '100px',
        inline: true,
        label: <b>Payment Due</b>,
        disabled: true,
        defValue: amount.paymentDue
    }

    const cashbackDueAttributes = {
        type: 'number',
        name: 'cashback_due',
        width: '100px',
        inline: true,
        label: <b>Cashback Due</b>,
        disabled: true,
        defValue: amount.cashbackDue
    }

    const discountAttributes = {
        type: 'number',
        name: 'discount',
        width: '100px',
        inline: true,
        disabled: true,
        //min: '0',
        label: <b>Discount</b>,
        //onChange: getDiscount,
        defValue: invoiceDetails?.discount
    }

    const cashReceivedAttributes = {
        type: 'number',
        name: 'cash_received',
        width: '100px',
        inline: true,
        min: '0',
        label: <b>Cash Received</b>,
        onChange: getCashReceived
    }

    const addProcedures = () => {
        setLoaderContent('Adding Procedure')
        setLoader(true)
        let newProcedures = procedures

        newProcedures.push({
            procedure_name: {},
            procedure_description: '',
            procedure_qty: '',
            procedure_price: '',
            notes: []
        })

        setProcedures(newProcedures)
        setTimeout(() => {
            setLoader(false)
        }, 3000)
    }

    const getIndex = (position, attributes) => {
        let newAttributes = { ...attributes, index: position, value: procedures[position][attributes.name] }
        return newAttributes
    }

    const removeProcedure = (position) => {
        setLoaderContent('Removing Procedure')
        setLoader(true)
        let newProcedures = procedures

        newProcedures.splice(position, 1)

        setProcedures(newProcedures)
        setTimeout(() => {
            setLoader(false)
        }, 3000)
    }

    const addTotal = () => {
        let sum = 0

        procedures.map((item) => {
            sum = sum + parseInt(item.procedure_price)
        })

        setAmount({
            ...amount,
            total: sum,
            orginalTotal: sum,
            netPayable: sum,
            originalPaymentDue: sum,
            paymentDue: sum,
        })
    }

    const closeProceduralNotesModal = () => {
        setShowAddProcedures(false)
    }

    const viewNotes = (procedure, index) => {
        let procedures = { notes: procedure.notes }
        setPosition(index)
        setSelectedProcedure(procedures)
        setShowAddProcedures(true)
    }

    const getNotes = (position, notes) => {
        let newProcedures = procedures
        newProcedures[position]["notes"] = notes

        setProcedures(newProcedures)
    }

    const closeCreateModal = () => {
        setShowCreate(false)
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
                fetchProcedures()
            }, 3000)
        }
    }

    const goBack = () => {
        window.location.href = './#/invoices'
    }

    const savePayment = async (data) => {
        const request = {
            url: `${REACT_APP_BASE_URL}/Invoice/SavePayment`,
            type: 'post',
            payload: data
        }

        setSavePaymentLoad(true)
        checkLoggedInUser()
        let savePaymentResponse = await APICaller(request)
        setSavePaymentResponse(savePaymentResponse)
    }

    const submitForm = () => {
        let updatedProcedures = []

        let newInvoiceHistory = {
            balance: amount.paymentDue,
            invoiceId: invoiceDetails.id,
            paidAmount: parseInt(amount.cashReceived),
            totalPaid: invoiceDetails.paidAmount + parseInt(amount.cashReceived),
            createdDate: invoiceDate.value.fieldValue,
        }

        invoiceDetails.invoiceDetails.map((item, index) => {
            let newDetails = {
                ...item,
                procedureNotes: JSON.stringify(procedures[index].notes),
            }

            updatedProcedures.push(newDetails)
        })

        invoiceDetails.invoiceHistory.push(newInvoiceHistory)

        const newInvoice = {
            ...invoiceDetails,
            additionalNotes: specialNotes,
            notes: medicationNotes,
            dueAmount: amount.paymentDue,
            invoiceDetails: updatedProcedures,
            paidAmount: invoiceDetails.paidAmount + parseInt(amount.cashReceived)
        }

        savePayment(newInvoice)
    }

    return <div>
        <Header backClick={goBack} back />
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card card-w-title">
                    {loader ? <Loader content={'Fetching Invoice Details'} /> :
                        <div className='invoice-parent'>
                            <div className='detail-container'>
                                <div className='doctor-container'>
                                    <strong><p style={{ fontSize: 20 }}>Doctor Name</p></strong>
                                    <p>{invoiceDetails.doctor.firstname + " " + invoiceDetails.doctor.lastname}</p>
                                </div>
                                <div className='patient-container'>
                                    <strong><p style={{ fontSize: 20 }}>Patient Name</p></strong>
                                    <p>{invoiceDetails.patient.firstname + " " + invoiceDetails.patient.lastname}</p>
                                </div>
                                <div className='date-container'>
                                    <strong><p style={{ fontSize: 20 }}>Invoice Date</p></strong>
                                    <p>{new Date(invoiceDetails.createdDate).toLocaleString("en-PK", { timeZone: "Australia/Brisbane", year: 'numeric', month: '2-digit', day: '2-digit', weekday: "long", hour: '2-digit', hour12: true, minute: '2-digit', second: '2-digit' })}</p>
                                </div>
                                <div className='date-container'>
                                    <DateField features={invoiceDateSchema} />
                                </div>
                            </div>

                            <div className='main-invoice-container' style={{ marginTop: 20 }}>
                                <div className='procedures-container'>
                                    <strong><p style={{ fontSize: 20, marginBottom: 20 }}>Procedures</p></strong>
                                    <div className='procedure-headers'>
                                        <div className='name-container'>
                                            <strong>Name</strong>
                                        </div>
                                        <div className='description-container'>
                                            <strong>Description</strong>
                                        </div>
                                        <div className='quantity-container'>
                                            <strong>Quantity</strong>
                                        </div>
                                        <div className='price-container'>
                                            <strong>Price</strong>
                                        </div>
                                        <div className='notes-container'>
                                            <strong>Notes</strong>
                                        </div>
                                    </div>
                                    <div className='scrollable-container'>
                                        {loader ? <Loader content={loaderContent} /> :
                                            procedures.map((item, index) => (
                                                <div className='single-procedure'>
                                                    <div className='name-container'>
                                                        <p>{item.procedure_name}</p>
                                                    </div>
                                                    <div className='description-container'>
                                                        <p>{item.procedure_description}</p>
                                                    </div>
                                                    <div className='quantity-container'>
                                                        <p>{item.procedure_qty}</p>
                                                    </div>
                                                    <div className='price-container'>
                                                        <p>{item.procedure_price}</p>
                                                    </div>
                                                    <div className='notes-container'>
                                                        <Button onClick={() => viewNotes(item, index)} style={{ width: 'auto', marginTop: 4.6 }} label="Procedural Notes" className="mr-2"></Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <Modal content={<ProceduralNotes index={position} procedure={selectedProcedure} notes={getNotes} close={closeProceduralNotesModal} />} header={'Procedural Notes'} show={showAddProcedures} hide={closeProceduralNotesModal} />

                                <div className='info-container'>
                                    <div className='notes-container'>
                                        <div className='medication-notes-container'>
                                            <h3>Medication Notes</h3>
                                            <MultilineField features={medicationNotesAttributes} />
                                        </div>
                                        <div className='special-notes-container'>
                                            <h3>Special Notes</h3>
                                            <MultilineField features={specialNotesAttributes} />
                                        </div>
                                    </div>

                                    <div className='amount-container'>
                                        <h3>Amount</h3>
                                        <br />
                                        <p><TextField features={totalAttributes} /></p>
                                        <p><TextField features={discountAttributes} /></p>
                                        <p><TextField features={netPayableAttributes} /></p>
                                        <p><TextField features={cashReceivedAttributes} /></p>
                                        <p><TextField features={paymentDueAttributes} /></p>
                                        <p><TextField features={cashbackDueAttributes} /></p>
                                    </div>
                                </div>

                                <Button onClick={submitForm} style={{ width: '100px', marginTop: 20 }} label="Save" className="mr-2"></Button>
                                <Button onClick={goBack} style={{ width: '100px', marginTop: 20, background: '#6c757d', border: '1px solid #6c757d' }} label="Cancel" className="mr-2"></Button>
                                {savePaymentLoad && <Loader simple={true} />}
                                {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    </div>
}

export default UpdateInvoice