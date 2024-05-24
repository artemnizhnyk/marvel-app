import './charList.scss';
import {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import PropTypes from "prop-types";

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charsAreEnded: false
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    };

    onCharListLoading = () => {
        this.setState({
            newItemsLoading: true
        });
    };

    onCharListLoaded = (newCharList) => {
        const charsAreEnded = newCharList.length < 9;
        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charsAreEnded
        }));
    };

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    };

    itemsRefs = [];

    setRef = (ref) => {
        this.itemsRefs.push(ref);
    };

    focusOnItem = (id) => {
        this.itemsRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRefs[id].classList.add('char__item_selected');
        this.itemsRefs[id].focus();
    };

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                ? {'objectFit': 'cover'}
                : {'objectFit': 'unset'};

            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
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
    }

    render() {

        const {charList, loading, error, offset, newItemsLoading, charsAreEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = (!loading && !error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                        disabled={newItemsLoading}
                        style={{display: charsAreEnded ? 'none' : 'block'}}
                        onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
};

export default CharList;