import React, { useState, useEffect, useRef } from 'react';
import TextField from '../../components/GenericComponents/TextField';
import { Button } from 'primereact/button';
import MultilineField from '../../components/GenericComponents/MultilineField';
import Modal from '../../components/GenericComponents/Modal';
import Toast from '../../components/GenericComponents/Toast';
import ProceduralNotes from './add_procedural_notes';
import Loader from '../../components/GenericComponents/Loader';
import Select from '../../components/GenericComponents/Select';
import APICaller from '../../components/GenericComponents/APICaller';
import CreateProcedure from '../Procedures'
import { checkLoggedInUser } from '../../components/GenericComponents/Utilities';
const { REACT_APP_BASE_URL } = process.env

const NewProcedures = (props) => {
    const [procedures, setProcedures] = useState([{
        procedure_name: {},
        procedure_description: '',
        procedure_qty: '1',
        procedure_price: '',
        notes: []
    }])

    const [disabledAdd, setDisabledAdd] = useState(true)
    const [loader, setLoader] = useState(false)
    const [loaderContent, setLoaderContent] = useState('')
    const [amount, setAmount] = useState({
        total: 0,
        originalTotal: 0,
        discount: 0,
        netPayable: 0,
        cashReceived: 0,
        originalPaymentDue: 0,
        paymentDue: 0,
        cashbackDue: 0,
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
    const [originalProcedures, setOriginalProcedures] = useState([])
    const [changeProcedureDetails, setChangeProcedureDetails] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [removed, setRemoved] = useState(false)
    const [changeAmount, setChangeAmount] = useState(false)
    const [changePaymentDue, setChangePaymentDue] = useState(false)

    useEffect(() => {
        fetchProcedures()
    }, [])

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

                setOriginalProcedures(proceduresResponse)
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
        props.data({ amount: amount })
    }, [amount])

    useEffect(() => {
        props.data({ medicationNotes: medicationNotes})
    }, [medicationNotes])

    useEffect(() => {
        props.data({ specialNotes: specialNotes})
    }, [specialNotes])

    const checkAmount = () => {
        setChangeAmount(true)
        let sum = 0

        procedures.map((item) => {
            if(item.procedure_price.length) {
                if(item.procedure_qty.length) {
                    let total = parseInt(item.procedure_qty) * parseInt(item.procedure_price)
                    sum += total
                } else {
                    sum += sum + parseInt(item.procedure_price)
                }
            }
        })

        setAmount({
            ...amount,
            total: sum,
            originalTotal: sum,
            netPayable: sum,
            originalPaymentDue: sum,
            paymentDue: sum,
            discount: 0,
            cashbackDue: 0,
            cashReceived: 0
        })

        setTimeout(() => {
            setChangeAmount(false)
        }, 1)
    }

    const procedureDetails = (id, index) => {
        if (procedures.length == 1 && !removed) {
            setChangeProcedureDetails(true)

            let changedProcedure = originalProcedures.filter((item) => {
                return item.id == id
            })

            let newProcedures = procedures
            newProcedures[index] = {
                ...newProcedures[index],
                procedure_description: changedProcedure[0].description,
                procedure_price: JSON.stringify(changedProcedure[0].price)
            }

            setProcedures(newProcedures)
            setTimeout(() => {
                setChangeProcedureDetails(false)
            }, 5)
        }
        else if (!removed && procedures.length > 1 && Object.keys(procedures[procedures.length - 2].procedure_name).length) {
            setChangeProcedureDetails(true)

            let changedProcedure = originalProcedures.filter((item) => {
                return item.id == id
            })

            let newProcedures = procedures
            newProcedures[index] = {
                ...newProcedures[index],
                procedure_description: changedProcedure[0].description,
                procedure_price: JSON.stringify(changedProcedure[0].price)
            }

            setProcedures(newProcedures)
            setTimeout(() => {
                setChangeProcedureDetails(false)
            }, 1)
        }
    }

    const getValue = (value) => {
        let newProcedures = procedures

        if (value.fieldName == 'procedure_name' && typeof value.fieldValue == 'object') {
            if (value.fieldValue) {
                setSelectedIndex(value.index)
                procedureDetails(value.fieldValue.code, value.index)
            }
        }

        newProcedures[value.index][value.fieldName] = value.fieldValue == null ? {} : value.fieldValue

        setProcedures(newProcedures)
        props.data({ procedures: procedures })
        checkAmount()
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
            newAmount = amount.originalTotal
        } else {
            newAmount = amount.originalTotal - parseInt(value.fieldValue)
        }

        if(amount.cashReceived.length || amount.cashReceived != 0) {
            setChangePaymentDue(true)
        }

        setAmount({
            ...amount,
            discount: value.fieldValue,
            total: newAmount,
            netPayable: newAmount,
            originalPaymentDue: newAmount,
            paymentDue: JSON.stringify(newAmount - amount.cashReceived)
        })

        setTimeout(() => {
            setChangePaymentDue(false)
        }, 1)
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
        onChange: getMedicationNotes
    }

    const specialNotesAttributes = {
        name: 'special_notes',
        rows: 5,
        onChange: getSpecialNotes
    }

    const totalAttributes = {
        type: 'number',
        name: 'total',
        width: '100px',
        inline: true,
        min: '0',
        bold: true,
        label: "Total",
        disabled: true,
        defValue: amount.originalTotal
    }

    const netPayableAttributes = {
        type: 'number',
        name: 'net_payable',
        width: '100px',
        inline: true,
        min: '0',
        bold: true,
        label: "Net Payable",
        disabled: true,
        defValue: amount.netPayable
    }

    const paymentDueAttributes = {
        type: 'number',
        name: 'payment_due',
        width: '100px',
        inline: true,
        bold: true,
        label: "Payment Due",
        disabled: true,
        loading: changePaymentDue,
        defValue: amount.paymentDue
    }

    const cashbackDueAttributes = {
        type: 'number',
        name: 'cashback_due',
        width: '100px',
        inline: true,
        bold: true,
        label: "Cashback Due",
        disabled: true,
        defValue: amount.cashbackDue
    }

    const discountAttributes = {
        type: 'number',
        name: 'discount',
        width: '100px',
        inline: true,
        min: '0',
        bold: true,
        label: "Discount",
        loading: changeAmount,
        onChange: getDiscount
    }

    const cashReceivedAttributes = {
        type: 'number',
        name: 'cash_received',
        width: '100px',
        inline: true,
        required: true,
        bold: true,
        min: '0',
        label: "Cash Received",
        loading: changeAmount,
        onChange: getCashReceived
    }

    const addProcedures = () => {
        setLoaderContent('Adding Procedure')
        setLoader(true)

        let newProcedures = procedures

        newProcedures.push({
            procedure_name: {},
            procedure_description: '',
            procedure_qty: '1',
            procedure_price: '',
            notes: []
        })

        setProcedures(newProcedures)
        checkAmount()
        setTimeout(() => {
            setLoader(false)
        }, 1000)
    }

    const getIndex = (position, attributes) => {
        let newAttributes = { ...attributes, index: position, value: procedures[position][attributes.name] }
        return newAttributes
    }

    const removeProcedure = (position) => {
        setLoaderContent('Removing Procedure')
        setLoader(true)
        setRemoved(true)
        let newProcedures = procedures

        newProcedures.splice(position, 1)

        setProcedures(newProcedures)
        checkAmount()
        setTimeout(() => {
            setLoader(false)
        }, 1000)
        
        setTimeout(() => {
            setRemoved(false)
        }, 3000)
    }

    const closeProceduralNotesModal = () => {
        setShowAddProcedures(false)
    }

    const viewNotes = (procedure, index) => {
        setPosition(index)
        setSelectedProcedure(procedure)
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

    return <div className='main-invoice-container'>
        <div className='procedures-container'>
            <h3>Procedures</h3>
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
                                <Select features={getIndex(index, procedureNameAttributes)} />
                            </div>
                            <div className='description-container'>
                                {changeProcedureDetails && selectedIndex == index ? <div style={{ textAlign: 'center', marginTop: 5 }}><Loader simple /></div> : <MultilineField features={getIndex(index, procedureDescriptionAttributes)} />}
                            </div>
                            <div className='quantity-container'>
                                <TextField features={getIndex(index, procedureQtyAttributes)} />
                            </div>
                            <div className='price-container'>
                                {changeProcedureDetails && selectedIndex == index ? <div style={{ textAlign: 'center', marginTop: 5 }}><Loader simple /></div> : <TextField features={getIndex(index, procedurePriceAttributes)} />}
                            </div>
                            <div className='notes-container'>
                                <Button onClick={() => viewNotes(item, index)} style={{ width: 'auto', marginTop: 4.6 }} label="Procedural Notes" className="mr-2"></Button>
                                <Button disabled={procedures.length == 1 ? true : false} onClick={() => removeProcedure(index)} style={{ width: 'auto', background: '#fff', height: 35, border: 'none' }} className="mr-2"><i className='pi pi-times' style={{ color: 'red' }} /></Button>
                            </div>
                        </div>
                    ))}
            </div>

            <Button disabled={disabledAdd} onClick={addProcedures} style={{ marginTop: 5, border: 'none', width: 'auto', background: 'green', fontWeight: 'bolder', fontSize: 25, height: 40 }} className="mr-2">+</Button>
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
        {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
        <Modal header={'Create a Procedure'} content={<CreateProcedure calledFromModal modalState={getModalState} />} show={showCreate} hide={closeCreateModal} />
    </div>
}

export default NewProcedures