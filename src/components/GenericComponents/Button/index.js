import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';

const CustomButton = (props) => {
    let buttonStyle = {
        width: 'auto',
    }

    if(props.customStyle) {
        Object.assign(buttonStyle, props.customStyle)
    }

    return <Button onClick={props.onButtonClick} style={buttonStyle} label={props.label} className="mr-2"></Button>
}

export default CustomButton