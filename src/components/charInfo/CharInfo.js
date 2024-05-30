import "./charInfo.scss";
import {useEffect, useState} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";
import Skeleton from "../skeleton/Skeleton";
import PropTypes from "prop-types";

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId]);

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (this.props.charId !== prevProps.charId) {
    //         this.updateChar();
    //     }
    // }

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
            .getCharacterById(charId)
            .then(onCharLoaded)
            .catch(onError);
    };

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    };

    const onCharLoading = () => {
        setLoading(true);
    };

    const onError = () => {
        setLoading(false);
        setError(true);
        this.setState({
            loading: false,
            error: true
        });
    };

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = (!loading && !error && char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );

};

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let imgStyle = {"objectFit": "cover"};
    if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
        imgStyle = {"objectFit": "unset"};
    }

    return (<>
        <div className="char__basics">
            <img src={thumbnail} alt="abyss" style={imgStyle}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
        <ul className="char__comics-list">
            {comics.length > 0 ? null : "There is no comics with this character"}
            {
                comics.map((item, i) => {
                    if (i >= 10) return;
                    return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                    );
                })
            }


        </ul>
    </>);
};

CharInfo.propTypes = {
    charId: PropTypes.number
};

export default CharInfo;