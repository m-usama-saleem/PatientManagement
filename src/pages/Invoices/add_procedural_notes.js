import React, { useState, useEffect, useRef } from 'react';
import TextField from '../../components/GenericComponents/TextField';
import { Button } from 'primereact/button';
import MultilineField from '../../components/GenericComponents/MultilineField';
import Loader from '../../components/GenericComponents/Loader';

const ProceduralNotes = (props) => {

    const [proceduralNotes, setProceduralNotes] = useState([])

    useEffect(() => {
        let existingNotes = props.procedure.notes

        if(existingNotes.length) {
            setProceduralNotes(existingNotes)
        } else {
            setProceduralNotes([{
                note: ''
            }])
        }
    }, [])

    const [disabledAdd, setDisabledAdd] = useState(true)
    const [loader, setLoader] = useState(false)
    const [loaderContent, setLoaderContent] = useState('')

    const addNote = () => {
        setLoaderContent('Adding Note')
        setLoader(true)

        let notes = proceduralNotes

        notes.push({
            note: ''
        })

        setProceduralNotes(notes)

        setTimeout(() => {
            setLoader(false)
        }, 1000)
    }

    const getProceduralNotes = (value) => {
        let newNotes = proceduralNotes
        newNotes[value.index]["note"] = value.fieldValue

        if(newNotes[newNotes.length - 1].note.length) {
            setDisabledAdd(false)
        } else {
            setDisabledAdd(true)
        }

        setProceduralNotes(newNotes)
    }

    const proceduralNotesAttributes = {
        name: 'procedural_notes',
        rows: 5,
        onChange: getProceduralNotes
    }

    const getNote = (element, position) => {
        let newAttributes = { ...proceduralNotesAttributes, index: position, value: element.note }
        return newAttributes
    }

    const saveNotes = () => {
        props.notes(props.index, proceduralNotes)
        props.close()
    }

    const removeNote = (position) => {
        setLoaderContent('Removing Note')
        setLoader(true)
        let newNotes = proceduralNotes

        newNotes.splice(position, 1)
        setProceduralNotes(newNotes)

        setTimeout(() => {
            setLoader(false)
        }, 1000)
    }

    return <div className='procedural-notes-container'>
        {loader ? <Loader content={loaderContent} /> :
            proceduralNotes.map((item, index) => (
                <div className='note-container'>
                    <div className='field-container'>
                        <MultilineField features={getNote(item, index)} />
                    </div>
                    <div className='remove-container'>
                        <Button disabled={proceduralNotes.length == 1 ? true : false} onClick={() => removeNote(index)} style={{ width: 'auto', background: '#fff', height: 35, border: 'none' }} className="mr-2"><i className='pi pi-times' style={{ color: 'red' }} /></Button>
                    </div>
                </div>
            ))}

        <Button disabled={disabledAdd} onClick={addNote} style={{ marginTop: 5, border: 'none', width: 'auto', background: 'green', fontWeight: 'bolder', fontSize: 25, height: 40 }} className="mr-2">+</Button>
        <Button onClick={saveNotes} style={{ marginTop: 5, border: 'none', width: 'auto', height: 40 }} className="mr-2">Save</Button>
    </div>
}

export default ProceduralNotes