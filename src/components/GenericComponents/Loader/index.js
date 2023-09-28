import React, { useState, useEffect, useRef } from 'react';

const Loader = (props) => (
    props.simple ? <i className='pi pi-spin pi-spinner' style={{ fontSize: '2rem' }}></i> :
        <div style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 20 }}>
            <i className='pi pi-spin pi-spinner' style={{ fontSize: '2rem' }}></i>
            <br /><br />{props.content}
        </div>
)

export default Loader