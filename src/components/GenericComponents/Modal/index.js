import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const Modal = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        setDisplayBasic(props.show)
    }, [props])

    const hideModal = () => {
        setDisplayBasic(false)
        props.hide(false)
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="grid">
                <div className="col-12 lg:col-6">
                    <Dialog header={props.header ? props.header : ''} visible={displayBasic} style={{ width: '50vw' }} modal onHide={hideModal}>
                       {props.content}
                    </Dialog>
                </div>
            </div>
        </>
    );
};

export default Modal;