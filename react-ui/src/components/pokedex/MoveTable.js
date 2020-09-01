import React, { useCallback, useEffect, useState, createRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap'
import { titleFormatter as title } from '../Utilities'
import styles from './pokedexstyles.css'

export default function MoveTable(props) {
    const tableRef = React.createRef();

    const { SearchBar } = Search;
    const columns = [{
        classes: 'col-style',
        dataField: 'name',
        text: 'Move',
        formatter: typeFormatter,
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'damage_class',
        formatter: damageClassFormatter,
        text: 'Damage Class',
    }, {
        classes: 'col-style',
        dataField: 'power',
        text: 'Power',
        sort: true,
        formatter: numberFormatter
    }, {
        classes: 'col-style',
        dataField: 'accuracy',
        text: 'Accuracy',
        sort: true,
        formatter: numberFormatter
    }, {
        classes: 'col-style',
        dataField: 'pp',
        text: 'PP',
        formatter: numberFormatter,
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'priority',
        text: 'Priority',
        sort: true,
        formatter: numberFormatter
    }]

    function typeFormatter(cell, row) {
        return (<>
            {title(cell)} <br />
            <div className="type-icon" style={{ backgroundColor: row.type.color }}>{row.type.name}</div>
        </>)
    }

    function damageClassFormatter(cell, row) {
        return (<>{title(cell)}</>)
    }

    function numberFormatter(cell, row) {
        return cell == null ? 'N/A' : cell
    }

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
            Showing { from } to { to } of { size } Results
        </span>
    );
    
    const options = {
    paginationSize: 4,
    pageStartIndex: 0,
    // alwaysShowAllBtns: true, // Always show next and previous button
    // withFirstAndLast: false, // Hide the going to First and Last page button
    // hideSizePerPage: true, // Hide the sizePerPage dropdown always
    // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
    firstPageText: 'First',
    prePageText: 'Back',
    nextPageText: 'Next',
    lastPageText: 'Last',
    nextPageTitle: 'First page',
    prePageTitle: 'Pre page',
    firstPageTitle: 'Next page',
    lastPageTitle: 'Last page',
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [{
        text: '75', value: 75
    }, {
        text: '200', value: 200
    }, {
        text: 'All', value: props.moves.length
    }] // A numeric array is also available. the purpose of above example is custom the text
    };

    return (
        <div className='pokedex-wrapper-class'>
            <span className='table-wrapper'>
                <ToolkitProvider
                    keyField="id"
                    data={props.moves}
                    columns={columns}
                    search
                >
                    {props => (
                        <React.Fragment>
                            <br />
                            <SearchBar {...props.searchProps} />
                            <hr />
                            <BootstrapTable  {...props.baseProps}
                                ref={n => tableRef.current = n}
                                condensed
                                striped
                                bordered={false}
                                columnStyle="col-style"
                                pagination={ paginationFactory(options) }

                            />
                        </React.Fragment>
                    )}
                </ToolkitProvider>
            </span>
        </div>
    )
}