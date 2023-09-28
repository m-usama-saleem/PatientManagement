import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { checkLoggedInUser } from '../../components/GenericComponents/Utilities';
import APICaller from '../../components/GenericComponents/APICaller';
import Loader from '../../components/GenericComponents/Loader';
import Toast from '../../components/GenericComponents/Toast';
const { REACT_APP_BASE_URL, REACT_APP_SECRET_KEY } = process.env

const Invoice = (props) => {
    const [loader, setLoader] = useState(true)
    const [invoiceDetailsResponse, setInvoiceDetailsResponse] = useState()
    const [invoiceDetails, setInvoiceDetails] = useState()
    const [toastStatus, setToastStatus] = useState(false)
    const [toastType, setToastType] = useState('')
    const [toastHeader, setToastHeader] = useState('')
    const [toastMessage, setToastMessage] = useState('')
    const [emptyRows, setEmptyRows] = useState(0)

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
                let newEmptyRows = invoiceDetailsResponse.invoiceDetails

                while (newEmptyRows.length <= 6) {
                    newEmptyRows.push(null)
                }

                setEmptyRows(newEmptyRows)
                setTimeout(() => {
                    setLoader(false)
                }, 3000)
            }
        }
    }, [invoiceDetailsResponse])

    const toastSetting = (type, header, message, status) => {
        setToastType(type)
        setToastHeader(header)
        setToastMessage(message)
        setToastStatus(status)
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

    const print = () => {
        window.print();
    };

    const getCurrentDate = () => {
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let currentDate = `${day}/${month < 10 ? '0' + month : month}/${year}`;
        return currentDate
    }

    const getCurrentTime = (date) => {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const getInvoiceDate = (data) => {
        return new Date(data.createdDate).toLocaleString("en-PK", { timeZone: "Australia/Brisbane", year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: true, minute: '2-digit' })
    }

    return (
        <div>
            {toastStatus && <Toast type={toastType} header={toastHeader} message={toastMessage} />}
            {loader ? <div style={{ textAlign: 'center' }}><Loader content={'Loading Invoice'} /></div> :
                <div>
                    <div style={{ display: 'flex' }}>
                        <Button type="button" label="Back" onClick={() => window.history.back()} style={{ display: 'block', marginBottom: '20px', marginLeft: '6px' }}></Button>
                        <Button type="button" label="Print" icon="pi pi-print" onClick={print} style={{ display: 'block', marginBottom: '20px', marginLeft: '6px' }}></Button>
                    </div>

                    <div className="grid">
                        <div className="col">
                            <div className="card">
                                <div id="invoice-content">
                                    <div className="invoice">
                                        <div className='main-invoice-header'>
                                            <div className='invoice-heading-container'>
                                                <h1 style={{ marginBottom: 65 }}>INVOICE</h1>

                                                <div className='invoice-info-container'>
                                                    <div className='date-time-container'>
                                                        <p className='custom-font'>Date & Time</p>
                                                        <p>{getInvoiceDate(invoiceDetails)}</p>
                                                    </div>
                                                    <div className='invoice-number-container'>
                                                        <p className='custom-font'>INVOICE NO</p>
                                                        <p>{invoiceDetails.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='logo-container'>
                                                <div className='logo-holder'>
                                                    <img src='assets/layout/images/NW_logo.png' width={'70%'}/>
                                                </div>
                                                <p style={{ letterSpacing: 1 }}>B-263, N-Block North Nazimabad<br />Karachi<br />Phone: 0347-2402331</p>
                                            </div>
                                        </div>

                                        <div className='bill-to-container'>
                                            <div className='header'>
                                                <p>Bill To</p>
                                            </div>

                                            <div className='bill-info-container'>
                                                <div className='consumer-container'>
                                                    <div className='heading-container'>
                                                        <p>Consumer Name</p>
                                                    </div>
                                                    <div className='info-container'>
                                                        <p>{invoiceDetails.patient.firstname + " " + invoiceDetails.patient.lastname}</p>
                                                    </div>
                                                </div>
                                                <div className='phone-container'>
                                                    <div className='heading-container'>
                                                        <p>Phone</p>
                                                    </div>
                                                    <div className='info-container'>
                                                        <p>{invoiceDetails.patient.contact}</p>
                                                    </div>
                                                </div>
                                                <div className='address-container'>
                                                    <div className='heading-container'>
                                                        <p>Address</p>
                                                    </div>
                                                    <div className='info-container'>
                                                        <p>{invoiceDetails.patient.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='invoice-procedures-container'>
                                            <div className='headers-container'>
                                                <div className='serial-no-container'>
                                                    <p>SL No.</p>
                                                </div>

                                                <div className='procedure-info-container'>
                                                    <p>Procedure</p>
                                                </div>

                                                <div className='price-container'>
                                                    <p>Price</p>
                                                </div>

                                                <div className='qty-container'>
                                                    <p>Quantity</p>
                                                </div>

                                                <div className='amount-container'>
                                                    <p>Amount</p>
                                                </div>
                                            </div>

                                            {invoiceDetails.invoiceDetails.map((item, index) => (
                                                <div className='row-container'>
                                                    <div className='serial-no-container'>
                                                        <p>{index + 1}</p>
                                                    </div>

                                                    <div className='procedure-info-container'>
                                                        <p>{item?.procedure?.name}</p>
                                                    </div>

                                                    <div className='price-container'>
                                                        <p>{item?.price}</p>
                                                    </div>

                                                    <div className='qty-container'>
                                                        <p>{item?.qty}</p>
                                                    </div>

                                                    <div className='amount-container'>
                                                        <p>{item != null ? item?.qty * item?.price : ''}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className='total-container'>
                                                <div className='serial-no-container'>
                                                </div>

                                                <div className='discount-left-container'>
                                                </div>

                                                <div className='discount-container'>
                                                    <p>Discount</p>
                                                </div>

                                                <div className='discount-right-container'>
                                                </div>

                                                <div className='amount-container'>
                                                    <p>Total Amount</p>
                                                </div>

                                                <div className='figure-container'>
                                                    <p>{invoiceDetails.totalAmount}</p>
                                                </div>
                                            </div>

                                            <div className='final-container'>
                                                <div className='serial-no-container'>
                                                </div>

                                                <div className='discount-left-container'>
                                                </div>

                                                <div className='discount-container'>
                                                    <p>{invoiceDetails.discount}</p>
                                                </div>

                                                <div className='discount-right-container'>
                                                </div>

                                                <div className='amount-container'>
                                                    <p>Final Amount</p>
                                                </div>

                                                <div className='figure-container'>
                                                    <p>{invoiceDetails.netPayable}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='received-container'>
                                            <div className='by-container'>
                                                <p>Received by</p>
                                            </div>
                                            <div className='name-container'></div>
                                            <div className='paid-container'>
                                                <p>Paid</p>
                                            </div>
                                            <div className='amount-container'>
                                                <p>{invoiceDetails.paidAmount}</p>
                                            </div>
                                        </div>
                                        <div className='note-container'>
                                            <div className='heading-container'>
                                                <p>Note*</p>
                                            </div>
                                            <div className='info-container'></div>
                                            <div className='due-container'>
                                                <p>Due</p>
                                            </div>
                                            <div className='amount-container'>
                                                <p>{invoiceDetails.dueAmount}</p>
                                            </div>
                                        </div>

                                        <div className='query-container'>
                                            <div className='text-container'>
                                                <p>If you have any query about this invoice please contact us at<br />[Dr. Hamza Jawed, 0331-6076923 dr.hazmajawed@gmail.com]</p>
                                            </div>
                                            <div className='signature-container'>
                                                <hr className='signature-line' />
                                                <p>Signature and Seal</p>
                                            </div>
                                        </div>

                                        <div className='specs-container'>
                                            <div className='date-container'>
                                                {getCurrentDate()}
                                            </div>
                                            <div className='time-container'>
                                                {getCurrentTime(new Date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div>
    );
};

export default Invoice