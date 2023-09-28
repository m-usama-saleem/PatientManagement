import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'primereact/calendar';

const DateField = (props) => {
    const [selectedDate, setSelectedDate] = useState(props.features.defaultValue != null || props.features.defaultValue != undefined ? new Date(props.features.defaultValue) : new Date())
    const [validated, setValidated] = useState(true)
    let iconClassName = 'pi'
    let attributes = props.features

    if(attributes.icon) {
        iconClassName = iconClassName + ' pi-' + attributes.icon
    }

    useEffect(() => {
        attributes.onChange({
            fieldName: attributes.name,
            fieldValue: selectedDate,
            required: attributes.required,
            validated: validated,
            index: attributes.index,
            type: attributes.type
        })
    }, [validated, selectedDate])

    const getDateValue = (value) => {
        setSelectedDate(value)

        if(attributes.validation) {
            checkValidation(value)
        }
    }

    const checkValidation = (value) => {
        let validated = attributes.validation(value)
        setValidated(validated)
    }

    const getBorder = () => {
        if(attributes.validation) {
            if(!validated && selectedDate.length) {
                return '1px solid red'
            } else {
                return '1px solid #ced4da'
            }
        } 
    }

    const getRequired = (value) => {
        if(attributes.required) {
            return value + ' *'
        } else {
            return value
        }
    }

    return <div>
        {attributes.label && 
            <label htmlFor={attributes.name}>{getRequired(attributes.label)}</label>
        }
        <div style={{height: 5}} />
        {attributes.icon ? <span className="p-input-icon-left">
            <i className={iconClassName} />
            <Calendar maxDate={attributes.max ? attributes.max : ''} minDate={attributes.min ? attributes.min : ''} style={{border: getBorder() }} value={selectedDate} onChange={(e) => getDateValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'date'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />
        </span> : <Calendar maxDate={attributes.max ? attributes.max : ''} minDate={attributes.min ? attributes.min : ''} value={selectedDate} onChange={(e) => getDateValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'date'} placeholder={attributes.placeholder ? attributes.placeholder : ''} required={attributes.required ? true : false} /> }
    </div>
}

export default DateField