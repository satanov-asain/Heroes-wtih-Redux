import {useState,useEffect, useRef, useMemo, useLayoutEffect} from 'react';
import store from '../../redux/store'
import { apiChar } from '../../redux/api/apiChar';
import { useDispatch, useSelector } from 'react-redux/es/exports';
import { fetchCharInfo, increment} from '../../redux/slices/charSlice';
import { useGetAllCharactersQuery } from '../../redux/api/apiChar';
import { transformChar } from '../../services/MarvelService';

import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import setContent  from '../../utils/setContent';
import './charList.scss';

// const getContent = setContent('list');
const getContent=(status, Component, newItemsLoading) => {
    switch(status){
        case 'loading': 
            return newItemsLoading? <Component/>:<Spinner/>;
        case 'confirmed':
            return <Component/>
        case 'error':
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList=(props)=> {
    console.log('!-- NEW RENDER --!');
    const dispatch = useDispatch();
    // const {charLoadingStatus, charData, charId, count} = useSelector(state => state.char);

    const {loading,error, process, setProcess, getAllCharacters,clearError} = useMarvelService();

    const [charList,setCharList]=useState([]);
    const [newItemsLoading,setNewItemsLoading]=useState(false);
    const [offset,setOffset]=useState(210);
    const [offCopy, setOffCopy] = useState(210);
    const [limit, setLimit] = useState(9);
    const [charEnded,setCharEnded]=useState(false);
    const [just, setJust] = useState(0);
    const [localCharacterList, setLocalCharacterList] = useState([]);

    const {
        currentData: characterList = [],
        isError,
        isSuccess,
        isLoading,
        isFetching
    } = useGetAllCharactersQuery(offset);

    let isItemsLoading = isLoading || isFetching;
    let isStatus = isLoading?'loading':isFetching?'loading':isError?'error':'confirmed';

    useEffect(()=>{
        setCharList(charList => charList = []);
        setOffset(offset => offset=210);
    
        console.log('!-MOUNTED-!');
        console.log('!--ЗАПРОС--!');
        if(isStatus === 'confirmed'){
            onRequest(true);
        }
        setJust(just => just++);
        
        return () => {
            store.dispatch(apiChar.util.resetApiState());
        }
    },[]);
    useEffect(() => {
        console.log('!--ЗАПРОС--!');
        if(isStatus === 'confirmed'){
            onRequest(false);
        }
    }, [isStatus])

    const onRequest=(initial)=>{
        console.log('JUST Request');
        setNewItemsLoading(isStatus);
            onCharListLoaded(characterList);
        clearError();
    }

    const onCharListLoaded=(newCharList)=>{
        console.log('!-ДАЛЬШЕ-!');
        let ended = false;
        if(newCharList.length%9!=0){ended=true;}
        setCharList(charList=>charList.concat(characterList));
        setNewItemsLoading(isStatus);
        setCharEnded(ended);
        console.log('!-- LOADING Finished --!');    
    }

    const itemRefs = useRef([]);
   
    const focusOnItem = (id, itemId) => {
        dispatch(increment(10));
        dispatch(fetchCharInfo(itemId));
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const happy = (offset) => {
    setTimeout(() =>{wait(offset);},3000);
        
    };
    const wait = (offset) => {
        alert(`HAPPY ${offset}`);
    }
    const renderItems=(arr)=> {
        const items =  arr.map((item,i) => {
            let imgStyle=/image_not_available/.test(item.thumbnail)?
            {'objectFit':'unset'}:{'objectFit':'cover'};
            
            return (
                <CSSTransition key={item.id} timeout={500} classNames='char__item'>
                    <li 
                        className="char__item"
                        key={item.id}
                        tabIndex={0}
                        ref={elem=>itemRefs.current[i]=elem}
                        onClick={()=>{props.onSelectedChar(item.id);
                                    focusOnItem(i, item.id);}}
                        onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i, item.id);
                            }
                        }}                    
                        >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

        let elements=useMemo(()=>{
            return charList?getContent(isStatus, ()=>renderItems(charList), isItemsLoading):null;
        },[isStatus, charList, offset, characterList]);

        useEffect(()=>{
            if(characterList!=false){
                setLocalCharacterList([...characterList]);}
        },[characterList])

        useEffect(()=>{
            console.log('Offset touched --!', offset);
            if(offCopy!==offset){console.log('Offset CHANGED--!', offset)};
        },[offset])
        
        if(characterList!=false){
            // setLocalCharacterList([...localCharacterList, ...characterList]);
            console.log('!--Gotten RTK', offset, isLoading, isFetching, 'success : ', isSuccess);
        }else{ console.log('!--Empty RTK', offset, isLoading, isFetching, 'success : ', isSuccess)}
    
        console.log('isLoading',isItemsLoading);
        console.log('!--STATUS--!',isStatus);

        console.log('Full RTK', characterList);
        console.log('Full DATA', localCharacterList);
        console.log('Full LIST', charList);
 
        return (
            <div className="char__list">
                <button
                style={{'padding':'20px', 'border':'solid red 5px'}}
                onClick={()=>{happy(offset)}}
                >HAPPY</button>
                {elements}    
                <button className="button button__main button__long"
                        disabled={isItemsLoading}
                        style={{'display': charEnded?'none':'block'}}
                        onClick={()=>setOffset(offset => offset+9)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )


        
}

CharList.propTypes={
    onSelectedChar:PropTypes.func
}

export default CharList;

