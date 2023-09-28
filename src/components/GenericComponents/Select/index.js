import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Dropdown } from 'primereact/dropdown';
import Loader from '../Loader';

const Select = (props) => {
    const [selectedValue, setSelectedValue] = useState(null)
    const [validated, setValidated] = useState(true)
    const [autoValue, setAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [options, setOptions] = useState(props.features.options)
    const [loading, setLoading] = useState(false)

    let iconClassName = 'pi'
    let attributes = props.features

    if (attributes.icon) {
        iconClassName = iconClassName + ' pi-' + attributes.icon
    }

    useEffect(() => {
        if (attributes.value) {
            if(selectedValue == null && Object.keys(attributes.value).length) {
                setSelectedValue(attributes.value)
            }
        }
    }, [])

    useEffect(() => {
        attributes.onChange({
            fieldName: attributes.name,
            fieldValue: selectedValue,
            required: attributes.required,
            validated: validated,
            index: attributes.index,
            type: attributes.type
        })
    }, [validated, selectedValue])

    useEffect(() => {
        traverseOptions(props.features.options)
    }, [props])

    useEffect(() => {
        traverseOptions(props.features.options)
    }, [])

    useEffect(() => {
        setAutoValue(options)
    }, [options]);

    const traverseOptions = (existingOptions) => {
        var newOptions = existingOptions

        if (attributes.create) {
            let hasCreate = newOptions.filter((item) => {
                return item.code == 'create'
            })

            if (!hasCreate.length) {
                newOptions.unshift({ name: '+ Add', code: 'create' })
                setOptions(newOptions)
            }
        }
    }

    const removeFocus = () => {
        setTimeout(() => {
            document.activeElement.blur()
        }, 10)

        setLoading(true)

        setTimeout(() => {
            setLoading(false)
        }, 100)
    }

    const getSelectedValue = (event) => {
        if (event.target.value.code === 'create') {
            //setShowCreate(true)
            attributes.createFunction()
        } else {
            setSelectedValue(event.target.value)
        }

        if (attributes.validation) {
            checkValidation(event.target.value)
        }
    }

    const checkValidation = (value) => {
        let validated = attributes.validation(value)
        setValidated(validated)
    }

    const getBorder = () => {
        if (attributes.validation) {
            if (!validated && selectedValue.length) {
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

    const searchOptions = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };

    const getField = () => {
        if (attributes.searchable) {
            return <AutoComplete
                placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''}
                id={attributes.name}
                required={attributes.required ? true : false}
                dropdown
                //multiple 
                onSelect={removeFocus}
                value={selectedValue}
                onChange={(e) => getSelectedValue(e)}
                suggestions={autoFilteredValue}
                completeMethod={searchOptions}
                field={attributes.optionName} />
        } else {
            return <Dropdown
                value={selectedValue}
                onChange={(e) => getSelectedValue(e)}
                options={attributes.options}
                field={attributes.name}
                optionLabel={attributes.optionName}
                placeholder={attributes.placeholder ? getRequired(attributes.placeholder) : ''} />
        }
    }

    return <div>
        {attributes.label &&
            <label htmlFor={attributes.name}>{getRequired(attributes.label)}</label>
        }
        <div style={{ height: 5 }} />
        {loading ? <div></div> : attributes.icon ? <span className="p-input-icon-left">
            <i className={iconClassName} />
            {getField()}
        </span> : getField()}
    </div>
}

export default Select