import React, { useCallback, useEffect, useState, createRef } from 'react';
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button } from 'react-bootstrap'
import { titleFormatter as title } from '../Utilities'
import styles from './pokedexstyles.css'

export default function PokemonTable(props) {
    const tableRef = React.createRef();

    const { SearchBar } = Search;
    const columns = [{
        classes: 'col-style',
        dataField: 'id',
        text: 'Dex #',
        sort: true,
        formatter: spriteFormatter
    }, {
        classes: 'col-style',
        dataField: 'name',
        text: 'Species',
        formatter: speciesFormatter,
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'ability_1',
        text: 'Ability',
        formatter: abilityFormatter
    }, {
        classes: 'col-style',
        dataField: 'hidden_ability',
        text: 'Hidden Ability',
        formatter: haFormatter
    }, {
        classes: 'col-style',
        dataField: 'base_hp',
        text: 'HP',
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'base_atk',
        text: 'ATK',
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'base_def',
        text: 'DEF',
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'base_spa',
        text: 'SPA',
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'base_spd',
        text: 'SPD',
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'base_spe',
        text: 'SPE',
        sort: true
    }]

    function spriteFormatter(cell, row) {
        return <><img src={row.sprite_link} />{cell}</>
    }

    function speciesFormatter(cell, row) {
        return (
            <>
                {cell} <br />
                <div className="type-icon" style={{ backgroundColor: row.type_1_color }}>{row.type_1}</div>
                {row.type_2 != null ?
                    <><div className="type-icon"
                        style={{ backgroundColor: row.type_2_color }}>{row.type_2}</div></> : ''}
            </>
        )
    }

    function abilityFormatter(cell, row) {
        return (
            <div>{row.ability_1}<br />{row.ability_2}</div>
        )
    }

    function haFormatter(cell) {
        return <>{cell}</>
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
        text: 'All', value: props.pokemon.length
    }] // A numeric array is also available. the purpose of above example is custom the text
    };

    return (
        <div className='pokedex-wrapper-class'>
            <span className='table-wrapper'>
                <ToolkitProvider
                    keyField="id"
                    data={props.pokemon}
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
                                headerStyle={{position: 'fixed'}}
                                pagination={ paginationFactory(options) }

                            />
                        </React.Fragment>
                    )}
                </ToolkitProvider>
            </span>
        </div>
    )
}