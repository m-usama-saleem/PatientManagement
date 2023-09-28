import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';

const Table = (props) => {
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

    const representatives = [
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];

    const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'];

    useEffect(() => {
        initFilters()
    }, [columns])

    useEffect(() => {
        setRows(props.rows)
        setColumns(props.columns)

        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, []);

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
    };

    const initFilters = () => {
        let filters = {}

        columns.map((item) => {
            filters = { ...filters, [item.field]: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] } }
            //More FilterOperator and FilterMatchMode
        })

        setFilters(filters);
    };

    const flag = (rowData) => {
        return (
            <React.Fragment>
                <img alt="flag" src="assets/demo/images/flags/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} width={30} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">
                    {rowData.country.name}
                </span>
            </React.Fragment>
        );
    };

    const clearButton = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} className="p-button-secondary"></Button>;
    };

    const applyButton = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} className="p-button-success"></Button>;
    };

    const profile = (rowData) => {
        const representative = rowData.representative;
        return (
            <React.Fragment>
                <img
                    alt={representative.name}
                    src={`assets/demo/images/avatar/${representative.image}`}
                    onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    width={32}
                    style={{ verticalAlign: 'middle' }}
                />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">
                    {representative.name}
                </span>
            </React.Fragment>
        );
    };

    const profileFilter = (options) => {
        return (
            <>
                <div className="mb-3 text-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`assets/demo/images/avatar/${option.image}`} width={32} style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">
                    {option.name}
                </span>
            </div>
        );
    };

    const dateTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const dateTemplateFilter = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const currency = (rowData) => {
        return formatCurrency(rowData.balance);
    };

    const currencyFilter = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const chip = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    };

    const chipFilter = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    };

    const progressBar = (rowData) => {
        return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '.5rem' }}></ProgressBar>;
    };

    const progressBarFilter = (options) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const toggle = (rowData) => {
        return <i className={classNames('pi', { 'text-green-500 pi-check-circle': rowData.verified, 'text-pink-500 pi-times-circle': !rowData.verified })}></i>;
    };

    const toggleFilter = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterCallback(e.value)} />;
    };

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <div className="card">
                    <DataTable
                        value={rows}
                        paginator
                        className="p-datatable-gridlines"
                        showGridlines
                        rows={props.rowsPerPage ? props.rowsPerPage : 10}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        loading={loading}
                        responsiveLayout="scroll"
                        emptyMessage="No data found."
                    >
                        {columns.map((item) => (
                            <Column
                                field={item.field}
                                header={item.header}
                                filterPlaceholder={`Search by ${item.header}`}
                                style={{ minWidth: '10rem', padding: '0.5rem 1rem', width: item?.width }}
                                filterMenuStyle={{ width: '14rem' }}
                                showFilterMenuOptions={false}
                                body={item.body ? item.body : undefined}
                                //body={flag | profile | date | currency | chip | progress | switch | custom}
                                //filterClear={default | clear button}
                                //filterApply={default | apply button}
                                //showFilterMatchMode={false} true by default
                                //showFilterMenuOptions={false} true by default
                                //filterElement={checkbox | date | selection | numbers | range | triple | custom}
                                sortable={item.sortable}
                                filter={item.filter} />
                        ))}

                        {/* <Column header="Country" field="country.name" style={{ minWidth: '12rem' }} body={flag} filter filterPlaceholder="Search by country" filterClear={clearButton} filterApply={applyButton} sortable />
                        <Column
                            header="Agent"
                            field="representative"
                            showFilterMatchModes={false}
                            filterMenuStyle={{ width: '14rem' }}
                            style={{ minWidth: '14rem' }}
                            body={profile}
                            filter
                            filterElement={profileFilter}
                            sortable
                        />
                        <Column header="Date" field="date" dataType="date" style={{ minWidth: '10rem' }} body={dateTemplate} filter filterElement={dateTemplateFilter} sortable />
                        <Column header="Balance" field="balance" dataType="numeric" style={{ minWidth: '10rem' }} body={currency} filter filterElement={currencyFilter} sortable />
                        <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={chip} filter filterElement={chipFilter} sortable />
                        <Column field="activity" header="Activity" showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={progressBar} filter filterElement={progressBarFilter} sortable />
                        <Column field="verified" header="Verified" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={toggle} filter filterElement={toggleFilter} sortable /> */}
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Table;