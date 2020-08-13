import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap'

const axios = require('axios')


// This component fetches pokemon, move, item, and ability data from https://pokeapi.co
// and calls my api to insert the data into by psql database

// this component is more complicated than it needs to be because I wrote
// it before I understood anything about Promises. So to handle the concurrency issues,
// I used buttons and waited a few seconds in between clicks. i still got all the
// data I needed this way!

export default function FetchPokedexData() {
    const abilityInitUrl = 'https://pokeapi.co/api/v2/ability?offset=0&limit=233'  // 233 abilities in main series up to gen 7
    const moveInitUrl = 'https://pokeapi.co/api/v2/move?offset=0&limit=728' // 728 moves in main series to gen 7
    const pokemonInitUrl = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=807' // 807 pokemon in main series to gen 7 (only plain forms)
    const itemInitUrl = 'https://pokeapi.co/api/v2/item/?offset=0&limit=954' // 954 items

    const insertAbilityEndpoint = '/api/insertAbility'
    const insertPokemonEndpoint = '/api/insertPokemon'
    const insertMoveEndpoint = '/api/insertMove'
    const insertItemEndpoint = '/api/insertItem'

    const [pokemonUrls, setPokemonUrls] = useState([])
    const [abilityUrls, setAbilityUrls] = useState([])
    const [moveUrls, setMoveUrls] = useState([])
    const [itemUrls, setItemUrls] = useState([])

    const [pokemons, setPokemons] = useState([])
    const [abilities, setAbilities] = useState([])
    const [moves, setMoves] = useState([])
    const [items, setItems] = useState([])

    const [isFetching, setIsFetching] = useState(false);
    const [inserting, setInserting] = useState("")

    // the init url returns more urls for each page of data
    async function fetchAbilityUrls() {
        setIsFetching(true)
        let response = await fetch(abilityInitUrl)
        let data = await response.json()
        setIsFetching(false)

        await setAbilityUrls(
            data.results.map(a => {
                return (a.url)
            }))
    }

    // get the data from the urls to the pages we got above,
    // and format to the json we will send to the api
    async function fetchAbilities() {
        setIsFetching(true)
        Promise.all(abilityUrls.map(async u =>
            await fetch(u)
                .then(response => response.json())
        ))
        .then(async data => {
            await setAbilities(data.map(a => {
                console.log("Promises resolved. Formatting ability " + a.id)
                return {
                    id: a.id,
                    name: a.name,
                    description: a.effect_entries[a.effect_entries.length-1].effect,
                    is_main_series: a.is_main_series
                }
            }))
            await setIsFetching(false)
        })
        .catch(e => {
            console.error('error', e);
        })
    }

    // send data to the api 
    async function insertAbilities() {
        setIsFetching(true)
        await axios
            .post(insertAbilityEndpoint, {
                abilities: abilities
            })
        .then(await setIsFetching(false))
        .catch(e => {
            console.error('error', e);
        })
    }


    async function fetchMoveUrls() {
        setIsFetching(true)
        let response = await fetch(moveInitUrl)
        let data = await response.json()
        setIsFetching(false)

        await setMoveUrls(
            data.results.map(m => {
                return (m.url)
            }))
    }

    async function fetchMoves() {
        setIsFetching(true)
        Promise.all(moveUrls.map(async u =>
            await fetch(u)
                .then(response => response.json())
        ))
        .then(async data => {
            await setMoves(data.map(m => {
                console.log("Promises resolved. Formatting move " + m.id)
                return {
                    id: m.id,
                    name: m.name,
                    type: m.type.name,
                    effect_chance: m.effect_chance,
                    effect: m.effect_entries[0].effect,
                    category: m.damage_class.name,
                    accuracy: m.accuracy,
                    power: m.power,
                    priority: m.priority,
                    pp: m.pp,
                }
            }))
            await setIsFetching(false)
        })
        .catch(e => {
            console.error('error', e);
        })
    }

    async function insertMoves() {
        setIsFetching(true)
        await axios
            .post(insertMoveEndpoint, {
                moves: moves
            })
        .then(await setIsFetching(false))
        .catch(e => {
            console.error('error', e);
        })
    }


    async function fetchPokemonUrls() {
        setIsFetching(true)
        let response = await fetch(pokemonInitUrl)
        let data = await response.json()
        setIsFetching(false)

        await setPokemonUrls(
            data.results.map(p => {
                return (p.url)
            }))
    }

    async function fetchPokemon() {
        setIsFetching(true)
        Promise.all(pokemonUrls.map(async u =>
            await fetch(u)
                .then(response => response.json())
        ))
        .then(async data => {
            await setPokemons(data.map(p => {
                console.log("Promises resolved. Formatting pokemon " + p.id)

                let ab_1 = null
                let ab_2 = null
                let h_ab = null

                p.abilities.forEach(ab => {
                    if (ab.is_hidden == true)
                        h_ab = ab.ability.name
                    else if (ab_1 == null)
                        ab_1 = ab.ability.name
                    else if (ab_2 == null)
                        ab_2 = ab.ability.name
                })

                console.log(ab_1)
                console.log(ab_2)
                console.log(h_ab)

                return {
                    id: p.id,
                    name: p.name,
                    primary_type: p.types[0].type.name,
                    secondary_type: typeof p.types[1] !== 'undefined' ?
                        p.types[1].type.name : null,
                    ability_1: ab_1,
                    ability_2: ab_2,
                    hidden_ability: h_ab,
                    base_hp: p.stats[5].base_stat,
                    base_atk: p.stats[4].base_stat,
                    base_def: p.stats[3].base_stat,
                    base_spa: p.stats[2].base_stat,
                    base_spd: p.stats[1].base_stat,
                    base_spe: p.stats[0].base_stat,
                    sprite_link: p.sprites.front_default,
                    height: p.height,
                    weight: p.weight
                }
            }))
            await setIsFetching(false)
        })
        .catch(e => {
            console.error('error', e);
        })
    }

    async function insertPokemon() {
        setIsFetching(true)
        await axios
            .post(insertPokemonEndpoint, {
                pokemon: pokemons
            })
        .then(await setIsFetching(false))
        .catch(e => {
            console.error('error', e);
        })
    }


    async function fetchItemUrls() {
        setIsFetching(true)
        let response = await fetch(itemInitUrl)
        let data = await response.json()
        setIsFetching(false)

        await setItemUrls(
            data.results.map(i => {
                return (i.url)
            }))
    }

    async function fetchItems() {
        setIsFetching(true)
        Promise.all(itemUrls.map(async u =>
            await fetch(u)
                .then(response => response.json())
        ))
        .then(async data => {
            await setItems(data.map(i => {
                console.log("Promises resolved. Formatting item " + i.id)
                return {
                    id: i.id,
                    name: i.name,
                    effect: i.effect_entries[0].effect,
                    fling_effect: i.fling_effect == null ? null : i.fling_effect.name,
                    fling_power: i.fling_power,
                    sprite_link: i.sprites.default
                }
            }))
            await setIsFetching(false)
        })
        .catch(e => {
            console.error('error', e);
        })
    }

    async function insertItems() {
        setIsFetching(true)
        await axios
            .post(insertItemEndpoint, {
                items: items
            })
        .then(await setIsFetching(false))
        .catch(e => {
            console.error('error', e);
        })
    }



    return (
        <div>
            I will fetch yer data!
            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchAbilityUrls()
            }}>Click me to fetch ability urls</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchAbilities()
            }}>Click me to fetch ability data</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                insertAbilities()
            }}>Click me to insert abilities into db</Button>
            <br />

            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchMoveUrls()
            }}>Click me to fetch move urls</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchMoves()
            }}>Click me to fetch move data</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                insertMoves()
            }}>Click me to insert moves into db</Button>
            <br />

            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchPokemonUrls()
            }}>Click me to fetch pokemon urls</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchPokemon()
            }}>Click me to fetch pokemon data</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                insertPokemon()
            }}>Click me to insert pokemon into db</Button>
            <br />

            <br/>
            <Button disabled variant='primary' onClick={() => {
                fetchItemUrls()
            }}>Click me to fetch item urls</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                fetchItems()
            }}>Click me to fetch item data</Button>
            <br />
            <Button disabled variant='primary' onClick={() => {
                insertItems()
            }}>Click me to insert items into db</Button>
            <br />

            {isFetching ? '\nfetching...\n' + inserting : '\ndone'}
        </div>
    )
}



