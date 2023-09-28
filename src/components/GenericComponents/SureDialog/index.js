import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Loader from '../Loader';

const SureDialog = (props) => {
    const toast = useRef(null);

    const confirmationDialogFooter = () => {
        return props.loading ? <Loader /> :
            <div>
                <Button style={{ color: 'green', borderColor: 'green' }} type="button" label="No" icon="pi pi-times" onClick={props.no} className="p-button-text" />
                <Button style={{ color: 'red', borderColor: 'red' }} type="button" label="Yes" icon="pi pi-check" onClick={props.yes} className="p-button-text" autoFocus />
            </div>
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog header="Confirmation" onHide={props.no} style={{ width: '350px' }} visible modal footer={confirmationDialogFooter}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>{props.content}</span>
                </div>
            </Dialog>
        </>
    );
};

export default SureDialog;