import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';

const Header = (props) => {
    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card card-w-title">
                    <div style={{ width: '100%', display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                            {props.back && <Button onClick={props.backClick} style={{ width: '100px' }} label="Back" className="mr-2"></Button>}
                        </div>
                        <div style={{ width: '50%', textAlign: 'right' }}>
                            {props.create && <Button onClick={props.createClick} style={{ width: '100px' }} label="Create" className="mr-2"></Button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header