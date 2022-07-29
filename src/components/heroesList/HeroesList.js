import { useCallback, useMemo} from 'react';
import { useSelector } from 'react-redux';

import {CSSTransition, TransitionGroup} from 'react-transition-group';

import { useGetHeroesQuery, useDeleteHeroMutation} from '../../api/apiSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const {
        data: heroes = [],
        isLoading,
        isError
    } = useGetHeroesQuery();
    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter); 

    const filteredHeroes = useMemo(() => {
        const filtered = heroes.slice();

        if(activeFilter === 'all'){
            return filtered;
        } else {
            return filtered.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter])

    const onDelete = useCallback((id)=>{
        deleteHero(id)
    },[])

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition timeout={0} classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }
  
        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} timeout={500} classNames="hero">
                    <HeroesListItem onDelete={() => onDelete(id)} key={id} {...props}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            <TransitionGroup component="ul">
                {elements}
            </TransitionGroup>
        </ul>
    )
}

export default HeroesList;


const returnObj = ( ) =>({
    isLoading: true,
    isError: false,
    message: 'hello'
})

const map = {isLoading, isError, message} = returnObj();

console.log(Object.keys(returnObj()).filter(i => i.includes('is')));