import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import Loader from '../Loader';

const TextField = (props) => {
    const [text, setText] = useState('')
    const [validated, setValidated] = useState(true)
    let iconClassName = 'pi'
    let attributes = props.features

    useEffect(() => {
        if(attributes?.loading == true) {
            setText('')
        }
    }, [attributes])

    useEffect(() => {
        if (attributes.value) {
            if (!text.length) {
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
                validated: validated,
                index: attributes.index,
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
            if(attributes.bold) {
                return <strong>{value + ' *'}</strong>
            } else {
                return value + ' *'
            }
        } else {
            if(attributes.bold) {
                return <strong>{value}</strong>
            } else {
                return value
            }
        }
    }

    const getLoadingField = () => {
        if (attributes?.loading == true) {
            return <div style={{ textAlign: 'center', marginTop: 3 }}><Loader simple /></div>
        } else {
            return <div>
                {attributes.icon ? <span className="p-input-icon-left">
                    <i className={iconClassName} />
                    <InputText disabled={attributes.disabled ? true : false} min={attributes.min ? attributes.min : ''} max={attributes.max ? attributes.max : ''} style={{ border: getBorder() }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />
                </span> : <InputText disabled={attributes.disabled ? true : false} min={attributes.min ? attributes.min : ''} max={attributes.max ? attributes.max : ''} style={{ border: getBorder(), width: attributes.width ? attributes.width : '' }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />}
            </div>
        }
    }

    const getInlineFields = () => {
        return <div style={{ width: '100%', display: 'flex' }}>
            <div style={{ width: '50%', paddingTop: 7 }}>
                {attributes.label &&
                    <label htmlFor={attributes.name}>{getRequired(attributes.label)}</label>
                }
            </div>
            <div style={{ width: '50%' }}>
                {getLoadingField()}
            </div>
        </div>
    }

    const getNormalFields = () => {
        return <div>
            {attributes.label &&
                <label htmlFor={attributes.name}>{getRequired(attributes.label)}</label>
            }
            <div style={{ height: 5 }} />
            {attributes.icon ? <span className="p-input-icon-left">
                <i className={iconClassName} />
                <InputText disabled={attributes.disabled ? true : false} min={attributes.min ? attributes.min : ''} max={attributes.max ? attributes.max : ''} style={{ border: getBorder() }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />
            </span> : <InputText disabled={attributes.disabled ? true : false} min={attributes.min ? attributes.min : ''} max={attributes.max ? attributes.max : ''} style={{ border: getBorder(), width: attributes.width ? attributes.width : '' }} value={text} onChange={(e) => getTextValue(e.target.value)} id={attributes.name} type={attributes.type ? attributes.type : 'text'} placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} required={attributes.required ? true : false} />}
        </div>
    }

    return attributes.inline ? getInlineFields() : getNormalFields()
}

export default TextField