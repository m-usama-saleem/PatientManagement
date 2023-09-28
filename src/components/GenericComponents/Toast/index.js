import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';

const Message = (props) => {
    const toast = useRef();

    useEffect(() => {
        let severity = props.type
        let summary = props.header
        let detail = props.message

        toast.current.show({
            severity: severity,
            summary: summary,
            detail: detail,
            life: 3000
        });
    }, [])

    return (
        <div style={{ position: 'absolute', zIndex: 99 }}>
            <Toast ref={toast} />
        </div>
    );
};

export default Message;