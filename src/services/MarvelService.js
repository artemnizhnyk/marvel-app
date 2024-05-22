class MarvelService {
    _apiBase = "https://gateway.marvel.com:443/v1/public/";
    _apiKey = "apikey=7cc24de3a684d0f82963fb317f721291";

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getAllCharacters = () => {
        return this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    };

    getCharacterById = (id) => {
        return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    };
}

export default MarvelService;