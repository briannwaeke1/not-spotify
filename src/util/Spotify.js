const clientId = 'fc40c6c8fb9942f280df567372858169';
const redirectUri = 'http://localhost:3000';

let accessToken;


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        // Use window.location.href and the .match() method to retrieve the access token and expiration time from the URL.
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // This clears the parameters, allowing us to grap a new acess token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },
// accepts a search term input, passes term to Spotify request, returns the response as a list of tracks in JSON format
   search(term) {
       const accessToken = Spotify.getAccessToken();
       return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { 
           headers: {
           Authorization: `Bearer ${accessToken}`
            }
            // Once the promise is fulfilled convert the returned response to JSON.
        }).then(response => {
            return response.json();
            // If the JSON does not contain any tracks, return an empty array.
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            // If the JSON does contain tracks, map the converted JSON to an array of tracks
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri

            }));
        })
    }
}


export default Spotify;