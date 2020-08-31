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
        dataField: 'game_id',
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
        dataField: 'abilities',
        text: 'Abilities',
        formatter: abilityFormatter
    }, {
        classes: 'col-style',
        dataField: 'stats[0].value',
        text: 'HP',
        //formatter: statsFormatter,
        //formatExtraData: {statName: 'hp'},
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'stats[1].value',
        text: 'ATK',
        // formatter: statsFormatter,
        // formatExtraData: {statName: 'attack'},
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'stats[2].value',
        text: 'DEF',
        // formatter: statsFormatter,
        // formatExtraData: {statName: 'defense'},
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'stats[3].value',
        text: 'SPA',
        // formatter: statsFormatter,
        // formatExtraData: {statName: 'special-attack'},
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'stats[4].value',
        text: 'SPD',
        // formatter: statsFormatter,
        // formatExtraData: {statName: 'special-defense'},
        sort: true
    }, {
        classes: 'col-style',
        dataField: 'stats[5].value',
        text: 'SPE',
        // formatter: statsFormatter,
        // formatExtraData: {statName: 'speed'},
        sort: true
    }]

    function spriteFormatter(cell, row) {
        return <><img src={row.sprite_link} />{cell}</>
    }

    function speciesFormatter(cell, row) {
        return (<>
            {cell} <br />
            {row.types.map(t => {
                return <div className="type-icon" style={{ backgroundColor: t.color }}>{t.name}</div>
            })}
        </>)
    }

    function abilityFormatter(cell, row) {
        return (row.abilities.map((a, index) => {
            return <div style={{fontStyle: a.is_hidden ? "italic" : "normal"}}>{a.name + (index !== row.abilities.length-1 ? ', ' : '')}</div>
        }))
    }

    function statsFormatter(cell, row, rowIndex, { statName }) {
            
        return (<>
            {row.stats.filter(s => s.name === statName)[0].value}
        </>)
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