import React, { useState, useEffect, useRef } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

const MultilineField = (props) => {
    const [text, setText] = useState('')
    const [validated, setValidated] = useState(true)
    let iconClassName = 'pi'
    let attributes = props.features

    useEffect(() => {
        if (attributes.value) {
            if(!text.length) {
                setText(attributes.value)
            }
        }
    }, [])

    useEffect(() => {
        if (attributes.defValue) {
            setText(attributes.defValue)
        }
    }, [attributes])

    if (attributes.icon) {
        iconClassName = iconClassName + ' pi-' + attributes.icon
    }

    useEffect(() => {
        if (attributes.onChange) {
            attributes.onChange({
                fieldName: attributes.name,
                fieldValue: text,
                required: attributes.required ? true : false,
                index: attributes.index,
                validated: validated,
                type: attributes.type
            })
        }
    }, [validated, text])

    const getTextValue = (value) => {
        setText(value)

        if (attributes.validation) {
            checkValidation(value)
        }
    }

    const checkValidation = (value) => {
        let validated = attributes.validation(value)
        setValidated(validated)
    }

    const getBorder = () => {
        if (attributes.validation) {
            if (!validated && text.length) {
                return '1px solid red'
            } else {
                return '1px solid #ced4da'
            }
        }
    }

    const getRequired = (value) => {
        if (attributes.required) {
            return value + ' *'
        } else {
            return value
        }
    }

    return <div>
        {attributes.label &&
            <label htmlFor={attributes.name}>{getRequired(attributes.label)}</label>
        }
        <div style={{ height: 5 }} />
        {attributes.icon ? <span className="p-input-icon-left">
            <i style={{ marginTop: '0px', top: '13%' }} className={iconClassName} />
            <InputTextarea rows={attributes.rows ? attributes.rows : 3} style={{ border: getBorder(), width: '100%', resize: 'vertical' }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />
        </span> : <InputTextarea rows={attributes.rows ? attributes.rows : 3} style={{ border: getBorder(), width: '100%', resize: 'vertical' }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />}
    </div>
}

export default MultilineField