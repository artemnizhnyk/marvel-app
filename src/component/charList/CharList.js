import "./charList.scss";
import {useEffect, useRef, useState} from "react";
import {useMarvelService} from "../.././service/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

const CharList = (props) => {
        const [charList, setCharList] = useState([]);
        const [newItemsLoading, setNewItemsLoading] = useState(false);
        const [offset, setOffset] = useState(210);
        const [charsAreEnded, setCharsAreEnded] = useState(false);

        const {error, loading, getAllCharacters} = useMarvelService();

        useEffect(() => {
            onRequest(offset, true);
        }, []);

        const onRequest = (offset, initial) => {
            initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
            getAllCharacters(offset)
                .then(onCharListLoaded)
        };

        const onCharListLoaded = (newCharList) => {
            const isCharsAreEnded = newCharList.length < 9;
            setCharList(charList => [...charList, ...newCharList]);
            setNewItemsLoading(newItemsLoading => false);
            setOffset(offset => offset + 9);
            setCharsAreEnded(charsAreEnded => isCharsAreEnded);
        };

        const itemsRefs = useRef([]);

        const focusOnItem = (id) => {
            itemsRefs.current.forEach(item => item.classList.remove("char__item_selected"));
            itemsRefs.current[id].classList.add("char__item_selected");
            itemsRefs.current[id].focus();
        };

        const renderItems = (arr) => {

            const items = arr.map((item, i) => {
                let imgStyle = item.thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
                    ? {"objectFit": "cover"}
                    : {"objectFit": "unset"};

                return (
                    <li className="char__item"
                        tabIndex={0}
                        ref={el => itemsRefs.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyUp={(e) => {
                            if (e.key === " " || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}
                    >
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                );
            });

            return (
                <ul className="char__grid">
                    {items}
                </ul>
            );
        };

        const items = renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading && !newItemsLoading ? <Spinner/> : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
                        style={{display: charsAreEnded ? "none" : "block"}}
                        onClick={() => onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
;

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
};

export default CharList;