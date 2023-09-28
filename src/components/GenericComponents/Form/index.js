import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import TextField from '../TextField';
import MultilineField from '../MultilineField';
import DateField from '../DateField';
import Select from '../Select';
import Miscellaneous from '../Miscellaneous'
import Toast from '../Toast';
import Loader from '../Loader';

const Form = (props) => {
    const [formValues, setFormValues] = useState({})
    const [schema, setSchema] = useState([])
    const [error, setError] = useState(false)
    const [reset, setReset] = useState(false)
    const [submitState, setSubmitState] = useState(false)

    useEffect(() => {
        setSchema(props.schema)
    }, [props])

    useEffect(() => {
        schema.map((item) => {
            addFields(item.div)
        })
    }, [schema])

    const getFieldInitialValue = (item) => {
        let fieldValue = ''

        if (item.type == 'date') {
            fieldValue = new Date()
        }

        if (item.type == 'date' &&
            Object.keys(formValues).includes(item.name) &&
            typeof formValues[item.name][item.name] == 'string') {
            fieldValue = new Date()
        }

        if (props.selected) {
            if (Object.keys(props.selected).length) {
                let exisitingValues = props.selected
                fieldValue = exisitingValues[item.name]
            }
        } else {
            if (Object.keys(formValues).includes(item.name)) {
                if (item.type != 'component') {
                    let value = formValues[item.name][item.name]

                    if (typeof value == 'object' && item.type != 'date') {
                        if (Object.keys(value).length) {
                            fieldValue = formValues[item.name][item.name]
                        }
                    } else {
                        if (formValues[item.name][item.name].length) {
                            fieldValue = formValues[item.name][item.name]
                        }

                        if (item.type == 'date' &&
                            typeof formValues[item.name][item.name] != 'string') {
                            fieldValue = formValues[item.name][item.name]
                        }
                    }
                }
            }
        }

        return fieldValue
    }

    const addFields = (fieldArray) => {
        let newFormValues = formValues

        fieldArray.map((item) => {
            Object.assign(newFormValues, { [item.name]: { [item.name]: getFieldInitialValue(item), validated: true, required: item.required == undefined ? false : true, index: item.index ? item.index : null } })
        })

        setFormValues(newFormValues)
    }

    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    const getUpdatedValue = (value) => {
        let fieldObject = {}
        Object.assign(fieldObject, { [value.fieldName]: value.fieldValue, validated: value.validated, required: value.required, index: value.index, type: value.type })

        setFormValues({
            ...formValues,
            [value.fieldName]: fieldObject
        })
    }

    const getField = (field) => {
        let newField = { ...field, onChange: getUpdatedValue, required: field.required ? true : false, validated: true, index: field.index ? field.index : null }

        if (props.selected) {
            if (Object.keys(props.selected).length) {
                let exisitingValues = props.selected
                let fieldName = newField.name.toLowerCase()

                Object.assign(newField, { value: exisitingValues[fieldName] })
            }
        }

        switch (field.type) {
            case 'text': return <TextField features={newField} />
            case 'multiline': return <MultilineField features={newField} />
            case 'date': return <DateField features={newField} />
            case 'number': return <TextField features={newField} />
            case 'select': return <Select features={newField} />
            case 'component': return <Miscellaneous features={newField} />
            default: return <TextField features={newField} />
            // case 'password': return <TextField type={field.type} required={field.required} icon={field.icon} placeholder={field.placeholder} label={field.label} name={field.name} onChange={getDoctorName} />
            // case 'number': return <TextField type={field.type} required={field.required} icon={field.icon} placeholder={field.placeholder} label={field.label} name={field.name} onChange={getDoctorName} />
        }
    }

    const getStructure = (parent) => {
        if (parent.length == 1) {
            return parent.map((item) => (
                <div className="field col-12">
                    {getField(item)}
                </div>
            ))
        } else if (parent.length == 2) {
            return parent.map((item) => (
                <div className="field col-12 md:col-6">
                    {getField(item)}
                </div>
            ))
        } else return parent.map((item) => (
            <div className="field col-12 md:col-4">
                {getField(item)}
            </div>
        ))
    }

    const submitForm = () => {
        let checkRequired = true
        let checkValidation = true
        let checkType = true
        let finalObject = {}

        Object.keys(formValues).forEach(function (key) {
            if (formValues[key]["required"] == true) {
                if (typeof formValues[key][key] == 'string') {
                    if (!formValues[key][key].length) {
                        checkRequired = false
                    }
                }

                if (typeof formValues[key][key] == 'object') {
                    if (!Object.keys(formValues[key][key]).length) {
                        checkRequired = false
                    }
                }
            }

            if (formValues[key]["type"] == 'select') {
                if (typeof formValues[key][key] != 'object') {
                    checkType = false
                }
            }

            if (formValues[key]["validated"] == false) {
                checkValidation = false
            }
        });

        if (checkRequired && checkValidation && checkType) {
            Object.keys(formValues).forEach(function (key) {
                Object.assign(finalObject, { [Object.keys(formValues[key])[0]]: formValues[key][key] })
            })

            props.submit(finalObject)
            setSubmitState(true)
            localStorage.setItem('formSubmit', true)
        } else {
            setError(true)

            setTimeout(() => {
                setError(false)
            }, 3000)
        }
    }

    const resetForm = () => {
        setReset(true)

        setTimeout(() => {
            setReset(false)
        }, 500)
    }

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <strong>Fields marked (*) are required.</strong>
                    <br /><br />
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="p-fluid formgrid grid">
                            {reset ? <div></div> : schema.map((item) => (
                                getStructure(item.div)
                            ))}
                        </div>

                        {error && <Toast type='error' header='Error' message='Please make sure all inputs are valid and required fields are filled.' />}
                        <Button disabled={submitState && localStorage.getItem('formSubmit') ? true : false} onClick={submitForm} type="submit" style={{ width: '100px', marginTop: 20 }} label={props.submitText ? props.submitText : "Save"} className="mr-2"></Button>
                        {props.hideCancelBtn ? '' : <Button disabled={submitState && localStorage.getItem('formSubmit') ? true : false} onClick={props.cancel ? props.cancel : resetForm} type="submit" style={{ width: '100px', marginTop: 20, background: '#6c757d', border: '1px solid #6c757d' }} label="Cancel" className="mr-2"></Button>}
                        {submitState && localStorage.getItem('formSubmit') && <Loader simple={true} />}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Form;