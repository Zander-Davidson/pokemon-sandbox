import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEdit, faPlus, faTrashAlt, faListUl, faSortUp, faSortDown, faSort, faRandom, faSortAmountUp, faSortAmountDown, faSortAmountUpAlt, faSortAmountDownAlt, faImage } from '@fortawesome/free-solid-svg-icons';
import styles from '../../styling/master.scss';

// could try making this automatic, only having to import the icon
// (icon, props) => {
//     return <FontAwesomeIcon icon={icon} {...props}/>
// }

export const Trash = (props) => {
    return <FontAwesomeIcon icon={faTrashAlt} {...props}/>
}

export const Edit = (props) => {
    return <FontAwesomeIcon icon={faEdit} {...props}/>
}

export const Plus = (props) => {
    return <FontAwesomeIcon icon={faPlus} {...props}/>
}

export const List = (props) => {
    return <FontAwesomeIcon icon={faListUl} {...props}/>
}

export const Random = (props) => {
    return <FontAwesomeIcon icon={faRandom} {...props}/>
}

export const Sort = (props) => {
    return <FontAwesomeIcon icon={faSort} {...props}/>
}

export const SortUp = (props) => {
    return <FontAwesomeIcon icon={faSortUp} {...props}/>
}

export const SortDown = (props) => {
    return <FontAwesomeIcon icon={faSortDown} {...props}/>
}

export const SortAmountUp = (props) => {
    return <FontAwesomeIcon icon={faSortAmountUp} {...props}/>
}

export const SortAmountDown = (props) => {
    return <FontAwesomeIcon icon={faSortAmountDown} {...props}/>
}

export const SortAmountUpAlt = (props) => {
    return <FontAwesomeIcon icon={faSortAmountUpAlt} {...props}/>
}

export const SortAmountDownAlt = (props) => {
    return <FontAwesomeIcon icon={faSortAmountDownAlt} {...props}/>
}

export const Image = (props) => {
    return <FontAwesomeIcon icon={faImage} {...props}/>
}

export const Search = (props) => {
    return <FontAwesomeIcon icon={faSearch} {...props}/>
}