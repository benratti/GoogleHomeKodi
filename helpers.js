'use strict'; // eslint-disable-line strict

const youtubeSearch = require('youtube-search');
const Fuse = require('fuse.js');
const DateHelper = require('./date/date.js');
const ResponseMaker = require('./speech/responses.js');
const URLEncode = require('urlencode');

// Set option for fuzzy search
const fuzzySearchOptions = {
    caseSensitive: false, // Don't care about case whenever we're searching titles by speech
    includeScore: true, // Don't need the score, the first item has the highest probability
    shouldSort: true, // Should be true, since we want result[0] to be the item with the highest probability
    threshold: 0.4, // 0 = perfect match, 1 = match all..
    location: 0,
    distance: 100,
    maxPatternLength: 64,
    keys: ['label']
};


const actionsHandler = {
    'movie.search.type': (request, response) => {
        kodiSearchMoviesByType(request, response);
    },
    'movie.play.trailer': (request, response) => {
        kodiPlayYoutube(request, response);
    },
    'movie.play.select': (request, response) => {
        kodiPlaySelectMovie(request, response);
    },
    'movie.play': (request, response) => {
        kodiPlayMovie(request, response);
    },
    'stop': (request, response) => {
        kodiStop(request, response);
    },
    'pause': (request, response) => {
        kodiPlayPause(request, response);
    },
    'movie.current': (request, response) => {
        kodiCurrentMovieDetails(request, response);
    },
    'movie.lastAdded': (request, response) => {
        kodiLastMovies(request, response);
    },
    'movie.title': (request, response) => {
        getMovieCard(request, response);
    }
}

exports.kodiManage = (request, response) => { // eslint-disable-line no-unused-vars
    let action = '';

    console.log('request : ' + request);
    console.log('Manager request received');
    action = request.body.result.action;
    console.log('Action : ' + action);
    actionsHandler[action](request, response);

//    let Kodi = request.kodi;
//
//    Kodi.Player.PlayPause({ // eslint-disable-line new-cap
//        playerid: 1
//    });
//    response.sendStatus(200);
};


const kodeHasActivePlayer = (Kodi) => {
    return new Promise((resolve, reject) => {
        console.log('Get active players');

        Kodi.Player.GetActivePlayers()
            .then((response) => {
                if (response && response.result && response.result.length > 0) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const kodiCurrentPlay = (Kodi) => {
    return new Promise((resolve, reject) => {
        console.log('Current Movie Details resquest');

        Kodi.Player.GetItem({ // eslint-disable-line new-cap
            playerid: 1,
//            properties: ["year", "title", "album", "artist", "director"]
            properties:  [
                "title",
                "artist",
                "albumartist",
                "genre",
                "year",
                "rating",
                "album",
                "track",
                "duration",
                "comment",
                "lyrics",
                "musicbrainztrackid",
                "musicbrainzartistid",
                "musicbrainzalbumid",
                "musicbrainzalbumartistid",
                "playcount",
                "fanart",
                "director",
                "trailer",
                "tagline",
                "plot",
                "plotoutline",
                "originaltitle",
                "lastplayed",
                "writer",
                "studio",
                "mpaa",
                "cast",
                "country",
                "imdbnumber",
                "premiered",
                "productioncode",
                "runtime",
                "set",
                "showlink",
                "streamdetails",
                "top250",
                "votes",
                "firstaired",
                "season",
                "episode",
                "showtitle",
                "thumbnail",
                "file",
                "resume",
                "artistid",
                "albumid",
                "tvshowid",
                "setid",
                "watchedepisodes",
                "disc",
                "tag",
                "art",
                "genreid",
                "displayartist",
                "albumartistid",
                "description",
                "theme",
                "mood",
                "style",
                "albumlabel",
                "sorttitle",
                "episodeguide",
                "uniqueid",
                "dateadded",
                "channel",
                "channeltype",
                "hidden",
                "locked",
                "channelnumber",
                "starttime",
                "endtime",
                "specialsortseason",
                "specialsortepisode",
                "compilation",
                "releasetype",
                "albumreleasetype",
                "contributors",
                "displaycomposer",
                "displayconductor",
                "displayorchestra",
                "displaylyricist",
                "userrating"
            ]
        })
            .then((item) => {
                if (!(item && item.result && item.result.item)) {
                    reject();
                }
                resolve(item);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });

};

const kodiPlayerProperties = (Kodi) => {
    return new Promise((resolve, reject) => {
        console.log('player properties');

        Kodi.Player.GetProperties({
            playerid: 1,
            properties: ["time", "totaltime"]
        })
            .then((properties) => {
                resolve(properties);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });

};


const moviestoListJSON = (movies) => {

    let introduction = ResponseMaker.get("movies-suggestion-list",{});

    let list = {
        "speech": introduction.speech,
        "messages": [
            {
                "type": "simple_response",
                "platform": "google",
                "textToSpeech": introduction.speech,
                "displayText": introduction.display
            },
            {
                //"type": "list_card",
                "type":"carousel_card",
                "platform": "google",
                //"title": "Films",
                "items": []
            },
            {
                "type": 0,
                "speech": "test"
            }
        ]
    };

    let speech = introduction;

    for (var i = 0; i < movies.result.movies.length; i++) {
        let movie = movies.result.movies[i];
        console.log(movie);

        let url;
        if ( movie.art && movie.art.fanart ) {
            url = URLEncode.decode(movie.art.fanart.split("image://")[1], "utf8");
            url = url.substring(0, url.lastIndexOf('/'));
        } else if ( movie.art && movie.art.poster ) {
            url = URLEncode.decode(movie.art.poster.split("image://")[1], "utf8");
            url = url.substring(0, url.lastIndexOf('/'));
        }


        list.messages[1].items[i] = {
            "optionInfo": {
                "key": movie.title,
                "synonyms": [
                    movie.label
                ]
            },
            "title": movie.title,
            "description": movie.plot.substring(0,100),
            "image": {
                "url": url,
                "accessibilityText": movie.title + " poster"
            }
        };

        if ((i < 5 && i < (movies.result.movies.length - 1)) || movies.result.movies.length == 1 ) {
            speech.speech = speech.speech + " " + movie.title + ", "; // + " réalisé en " + movie.year + ", ";
            // speech.display = speech.speechDisplay + movie.title + " réalisé en " + movie.year + ", ";
        }

        if ( i == 5 || ( i < 5 && i == (movies.result.movies.length - 1) && i > 0 ) ) {
                speech.speech = speech.speech + "et " + movie.title; // + " réalisé en " + movie.year + ", ";
                // speech.display = speech.speechDisplay + movie.title + " réalisé en " + movie.year + ", ";
        }

    }

    if ( movies.result.movies.length > 5) {
        speech.speech = speech.speech + ResponseMaker.get("other-movies",{}).speech;
    }

    list.messages[0].textToSpeech = "<speak>" + speech.speech + "</speak>";

    return list;


};

const kodiGetMoviesByType = (Kodi, type) => {
    return new Promise((resolve, reject) => {
        Kodi.VideoLibrary.GetMovies({
            properties: ["title", "year", "rating", "director","art","plot"],
            limits: {start: 0, end: 10},
            sort: {order: "descending", method: "random", ignorearticle: true},
            filter:{operator: "is", "field": "genre","value": type}
        })
            .then((movies) => {
                if (movies && movies.result && movies.result.movies) {
                    resolve(moviestoListJSON(movies));

                    //let speech = "J'ai trouvé des films ajoutés récemment, il s'agit de : \n";
                    //for (var i = 0; i < movies.result.movies.length; i++) {
                    //    let movie = movies.result.movies[i];
                    //    console.log(movie);
                    //    speech = speech + movie.title + " réalisé en " + movie.year + "\n";

                    //}

                    //resolve(speech);

                } else (
                    resolve()
                );
            }).catch((error) => {
            reject(error);
        });

    });

}

const kodiGetLastMovies = (Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.VideoLibrary.GetRecentlyAddedMovies({
            properties: ["title", "year", "rating", "director","art","plot"],
            limits: {start: 0, end: 10},
            sort: {order: "descending", method: "dateadded", ignorearticle: true}
        })
            .then((movies) => {
                if (movies && movies.result && movies.result.movies) {
                    resolve(moviestoListJSON(movies));

                    //let speech = "J'ai trouvé des films ajoutés récemment, il s'agit de : \n";
                    //for (var i = 0; i < movies.result.movies.length; i++) {
                    //    let movie = movies.result.movies[i];
                    //    console.log(movie);
                    //    speech = speech + movie.title + " réalisé en " + movie.year + "\n";

                    //}

                    //resolve(speech);

                } else (
                    resolve()
                );
            }).catch((error) => {
            reject(error);
        });

    });

}


const kodiLastMovies = (request, response) => {
    console.log('Last movies request');
    let Kodi = request.kodi;

    kodiGetLastMovies(Kodi)
        .then((speech) => {
            response.json(speech);
//            sendResponse(speech, response);
        })
        .catch((error) => {
            sendResponse(ResponseMaker.get("last-movie-not-found",[]));
            //sendResponse("Oups, je m'excuse, je n'ai pas réussi trouver les deniers films qui ont été ajouté");
        });

}


const kodiSearchMoviesByType = (request, response) => {
    console.log('search movies request');
    let movieType = request.body.result.parameters.type;


    let Kodi = request.kodi;

    kodiGetMoviesByType(Kodi, movieType)
        .then((speech) => {
            response.json(speech);
//            sendResponse(speech, response);
        })
        .catch((error) => {
            sendResponse(ResponseMaker.get("last-movie-not-found",[]));
            //sendResponse("Oups, je m'excuse, je n'ai pas réussi trouver les deniers films qui ont été ajouté");
        });

}

const kodiCurrentMovieDetails = (request, response) => {
    console.log('Current Movie Details resquest');
    let Kodi = request.kodi;

    kodeHasActivePlayer(Kodi)
        .then((hasActivePlayer) => {
            if (hasActivePlayer) {

                // si un player est actif, alors cherche le film en cours
                kodiCurrentPlay(Kodi)
                    .then((movie) => {
                        if (movie.result.item.type == "movie") {

                            kodiPlayerProperties(Kodi)
                                .then((properties) => {
                                    if (properties.result && properties.result.time && properties.result.totaltime) {
                                        let endDate = DateHelper.getEndDate(properties.result.time, properties.result.totaltime);

                                        movie.result.item.hours = endDate.getHours();
                                        movie.result.item.minutes = endDate.getMinutes();

                                        let subtitle = movie.result.item.director + " - " + movie.result.item.year;

                                        let url = URLEncode.decode(movie.result.item.art.fanart.split("image://")[1],"utf8");
                                        url = url.substring(0, url.lastIndexOf('/'));

                                        let card = {

                                            speech: ResponseMaker.get("current-movie-details-full",movie.result.item).speech,
                                            displayText: ResponseMaker.get("current-movie-details-simple", movie.result.item).display,
                                            title: movie.result.item.title,
                                            subtitle: subtitle,
                                            formattedText: movie.result.item.plot.substring(0,175) + "[...]",
                                            image : {
                                                url: url,
                                                accessibilityText: movie.result.item.title + " fanart"
                                            }

                                        };

                                        sendBodyCardResponse(card, response);

//                                        sendResponse(ResponseMaker.get("current-movie-details-full", movie.result.item), response);

                                    } else {

                                        sendResponse(ResponseMaker.get("current-movie-details-lite", movie.result.item), response);
                                    }

                                })
                                .catch((error) => {
                                    console.log(error);
                                    sendResponse(ResponseMaker.get("current-movie-details-lite", movie.result.item), response);
                                });

                        }
                    }).catch((error) => {
                    console.log(error);
                    sendResponse(ResponseMaker.get("current-movie-details-error", {}), response);

                });

            } else {
                sendResponse(ResponseMaker.get("current-movie-details-no-movie", {}), response);
            }
        }).catch((error) => {
            console.log(error);
            sendResponse(ResponseMaker.get("current-movie-details-error", {}), response);
    });


};

const kodiPlayPause = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Play/Pause request received');
    let Kodi = request.kodi;

    Kodi.Player.PlayPause({ // eslint-disable-line new-cap
        playerid: 1
    });
    sendResponse("C'est bon, je viens de le faire", response);
    //response.sendStatus(200);
};


const kodiStop = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Stop request received');
    let Kodi = request.kodi;

    Kodi.Player.Stop({ // eslint-disable-line new-cap
        playerid: 1
    });
    sendResponse("Voilà, le film est arrêté. Vous pouvez faire autre chose", response);
    //response.sendStatus(200);
};

exports.kodiMuteToggle = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('mute/unmute request received');
    let Kodi = request.kodi;

    Kodi.Application.SetMute({ // eslint-disable-line new-cap
        'mute': 'toggle'
    });
    response.sendStatus(200);
};

exports.kodiSetVolume = (request, response) => { // eslint-disable-line no-unused-vars
    let setVolume = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`set volume to "${setVolume}" percent request received`);
    Kodi.Application.SetVolume({ // eslint-disable-line new-cap
        'volume': parseInt(setVolume)
    });
    response.sendStatus(200);
};

exports.kodiActivateTv = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Activate TV request received');

    let Kodi = request.kodi;
    let params = {
        addonid: 'script.json-cec',
        params: {
            command: 'activate'
        }
    };

    Kodi.Addons.ExecuteAddon(params); // eslint-disable-line new-cap
};

const tryActivateTv = (request, response) => {
    if (process.env.ACTIVATE_TV != null && process.env.ACTIVATE_TV === 'true') {
        console.log('Activating TV first..');
        this.kodiActivateTv(request, response);
    }
};

const kodiFindMovie = (movieTitle, Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.VideoLibrary.GetMovies() // eslint-disable-line new-cap
            .then((movies) => {
                if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
                    throw new Error('no results');
                }

                // Create the fuzzy search object
                let fuse = new Fuse(movies.result.movies, fuzzySearchOptions);
                let searchResult = fuse.search(movieTitle);

                // If there's a result
                if (searchResult.length > 0) {
                    for ( var i = 0; i < searchResult.length; i++ ) {
                        console.log('Movie suggested: ' + searchResult[i].label);
                    }

                    let movieFound = searchResult[0];

                    console.log(`Found movie "${movieFound.label}" (${movieFound.movieid})`);
                    resolve(movieFound);
                } else {
                    reject(`Couldn't find movie "${movieTitle}"`);
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const kodiPlayMovie = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let movieTitle = request.body.result.parameters.title;
//    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    kodiFindMovie(movieTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                movieid: data.movieid
            }
        });
    }).catch((error) => {
        sendResponse("Oups, j'ai eu un problème. Je n'ai visiblement pas réussi à lancer le film", response);
        console.log(error);
    });
    sendResponse("Votre film devrait démarrer dans un instant", response);
    //response.sendStatus(200);
};

const kodiPlaySelectMovie = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let contexts = request.body.result.contexts;
    let movieTitle = "";

    for ( var i = 0 ; i < contexts.length ; i++) {
        if ( contexts[i].name == "actions_intent_option") {
            movieTitle = contexts[i].parameters.OPTION;
        }
    }


//    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    kodiFindMovie(movieTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                movieid: data.movieid
            }
        });
    }).catch((error) => {
        sendResponse("Oups, j'ai eu un problème. Je n'ai visiblement pas réussi à lancer le film", response);
        console.log(error);
    });
    sendResponse("Votre film devrait démarrer dans un instant", response);
    //response.sendStatus(200);
};

const kodiFindTvShow = (request, res, param) => {
    return new Promise((resolve, reject) => {
        let Kodi = request.kodi;

        Kodi.VideoLibrary.GetTVShows({ // eslint-disable-line new-cap
            'properties': ['file']
        }).then((shows) => {
            if (!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
                throw new Error('no results');
            }
            // Create the fuzzy search object
            let fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions);
            let searchResult = fuse.search(param.tvshowTitle);

            // If there's a result
            if (searchResult.length > 0 && searchResult[0].tvshowid != null) {
                resolve(searchResult[0]);
            } else {
                reject(`Couldn't find tv show "${param.tvshowTitle}"`);
            }
        }).catch((e) => {
            console.log(e);
        });
    });
};

const kodiPlayNextUnwatchedEpisode = (request, res, RequestParams) => {
    console.log(`Searching for next episode of Show ID ${RequestParams.tvshowid}...`);
    // Build filter to search unwatched episodes
    let param = {
        tvshowid: RequestParams.tvshowid,
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        // Sort the result so we can grab the first unwatched episode
        sort: {
            order: 'ascending',
            method: 'episode',
            ignorearticle: true
        }
    };
    let Kodi = request.kodi;

    Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            // Check if there are episodes for this TV show
            if (episodes) {
                console.log('found episodes..');
                // Check whether we have seen this episode already
                let firstUnplayedEpisode = episodes.filter((item) => {
                    // FIXME: This is returned from an async method. So what's the use for this?
                    return item.playcount === 0;
                });

                if (firstUnplayedEpisode.length > 0) {
                    let episdoeToPlay = firstUnplayedEpisode[0]; // Resolve the first unplayed episode

                    console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
                    let paramPlayerOpen = {
                        item: {
                            episodeid: episdoeToPlay.episodeid
                        }
                    };

                    Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                    return;
                }
            }
        })
        .catch((e) => {
            console.log(e);
        });
    res.sendStatus(200);
};

exports.kodiPlayTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    console.log(`TV Show request received to play "${param.tvshowTitle}"`);

    kodiFindTvShow(request, response, param).then((data) => {
        kodiPlayNextUnwatchedEpisode(request, response, data);
    });
};

const kodiPlaySpecificEpisode = (request, res, requestParams) => {
    console.log(`Searching Season ${requestParams.seasonNum}, episode ${requestParams.episodeNum} of Show ID ${requestParams.tvshowid}...`);

    // Build filter to search for specific season and episode number
    let param = {
        tvshowid: requestParams.tvshowid,
        season: parseInt(requestParams.seasonNum),
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        filter: {field: 'episode', operator: 'is', value: requestParams.episodeNum}
    };
    let Kodi = request.kodi;

    Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            // Check if there are episodes for this TV show
            if (episodes) {
                console.log('found episodes..');
                // Check for the episode number requested
                let matchedEpisodes = episodes.filter((item) => {
                    return item.episode === parseInt(requestParams.episodeNum);
                });

                if (matchedEpisodes.length > 0) {
                    let episdoeToPlay = matchedEpisodes[0];

                    console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
                    let paramPlayerOpen = {
                        item: {
                            episodeid: episdoeToPlay.episodeid
                        }
                    };

                    Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                    return;
                }
            }
        })
        .catch((e) => {
            console.log(e);
        });
    res.sendStatus(200);
};

exports.kodiPlayEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let requestPartOne = request.query.q.split('season');
    let param = {
        tvshowTitle: requestPartOne[0].trim().toLowerCase(),
        seasonNum: requestPartOne[1].trim().toLowerCase(),
        episodeNum: request.query.e.trim()
    };

    console.log(`Specific Episode request received to play ${param.tvshowTitle} Season ${param.seasonNum} Episode ${param.episodeNum}`);

    kodiFindTvShow(request, response, param).then((data) => {
        data.seasonNum = param.seasonNum;
        data.episodeNum = param.episodeNum;
        kodiPlaySpecificEpisode(request, response, data);
    });
};


exports.kodiShuffleEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvShowTitle = request.query.q;
    let param = {
        tvshowTitle: tvShowTitle.trim()
    };

    console.log(`A random Episode request received to play for show ${param.tvshowTitle}`);

    kodiFindTvShow(request, response, param).then((data) => {
        let paramGetEpisodes = {
            tvshowid: data.tvshowid,
            properties: ['playcount', 'showtitle', 'season', 'episode'],
            // Sort the result so we can grab the first unwatched episode
            sort: {
                method: 'episode',
                ignorearticle: true
            }
        };
        let Kodi = request.kodi;

        Kodi.VideoLibrary.GetEpisodes(paramGetEpisodes) // eslint-disable-line new-cap
            .then((episodeResult) => {
                if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                    throw new Error('no results');
                }
                let episodes = episodeResult.result.episodes;

                // Check if there are episodes for this TV show
                if (episodes) {
                    let randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];

                    console.log(`found episodes, picking random episode: ${randomEpisode.label}`);

                    let paramPlayerOpen = {
                        item: {
                            episodeid: randomEpisode.episodeid
                        }
                    };

                    Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                    return;
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });
};


const kodiOpenVideoWindow = (file, Kodi) => {
    let params = {
        'window': 'videos',
        'parameters': [file]
    };

    Kodi.GUI.ActivateWindow(params); // eslint-disable-line new-cap
};

exports.kodiOpenTvshow = (request, response) => {
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    kodiFindTvShow(request, response, param).then((data) => {
        kodiOpenVideoWindow(data.file, request.kodi);
    });
};

// Start a full library scan
exports.kodiScanLibrary = (request, response) => {
    request.kodi.VideoLibrary.Scan(); // eslint-disable-line new-cap
    response.sendStatus(200);
};

const tryPlayingChannelInGroup = (searchOptions, reqChannel, chGroups, currGroupI, Kodi) => {
    if (currGroupI < chGroups.length) {

        // Build filter to search for all channel under the channel group
        let param = {
            channelgroupid: 'alltv',
            properties: ['uniqueid', 'channelnumber']
        };

        Kodi.PVR.GetChannels(param).then((channels) => { // eslint-disable-line new-cap
            if (!(channels && channels.result && channels.result.channels && channels.result.channels.length > 0)) {
                throw new Error('no channels were found');
            }

            let rChannels = channels.result.channels;
            // Create the fuzzy search object
            let fuse = new Fuse(rChannels, searchOptions);
            let searchResult = fuse.search(reqChannel);

            // If there's a result
            if (searchResult.length > 0) {
                let channelFound = searchResult[0];

                console.log(`Found PVR channel ${channelFound.label} - ${channelFound.channelnumber} (${channelFound.channelid})`);
                Kodi.Player.Open({ // eslint-disable-line new-cap
                    item: {
                        channelid: channelFound.channelid
                    }
                });
            } else {
                tryPlayingChannelInGroup(searchOptions, reqChannel, chGroups, currGroupI + 1, Kodi);
            }
        }).catch((e) => {
            console.log(e);
        });
    }
};


const kodiPlayChannel = (request, response, searchOptions) => {
    let reqChannel = request.query.q.trim();

    console.log(`PVR channel request received to play "${reqChannel}"`);

    // Build filter to search for all channel under the channel group
    let param = {
        channelgroupid: 'alltv',
        properties: ['uniqueid', 'channelnumber']
    };
    let Kodi = request.kodi;

    Kodi.PVR.GetChannels(param).then((channels) => { // eslint-disable-line new-cap
        if (!(channels && channels.result && channels.result.channels && channels.result.channels.length > 0)) {
            throw new Error('no channels were found');
        }

        let rChannels = channels.result.channels;

        // We need to override getFn, as we're trying to search an integer.
        searchOptions.getFn = (obj, path) => {
            if (Number.isInteger(obj[path])) {
                return JSON.stringify(obj[path]);
            }
            return obj[path];
        };

        // Create the fuzzy search object
        let fuse = new Fuse(rChannels, searchOptions);
        let searchResult = fuse.search(reqChannel);

        // If there's a result
        if (searchResult.length > 0) {
            let channelFound = searchResult[0];

            console.log(`Found PVR channel ${channelFound.label} - ${channelFound.channelnumber} (${channelFound.channelid})`);
            Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    channelid: channelFound.channelid
                }
            });
        }
    }).catch((e) => {
        console.log(e);
    });

};

exports.kodiPlayChannelByName = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    kodiPlayChannel(request, response, fuzzySearchOptions);
};

exports.kodiPlayChannelByNumber = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let pvrFuzzySearchOptions = JSON.parse(JSON.stringify(fuzzySearchOptions));

    pvrFuzzySearchOptions.keys[0] = 'channelnumber';
    kodiPlayChannel(request, response, pvrFuzzySearchOptions);
};

const kodiPlayYoutube = (request, response) => { // eslint-disable-line no-unused-vars
    let searchString = request.body.result.parameters.title;
    let Kodi = request.kodi;

    if (!request.config.youtubeKey) {
        console.log('Youtube key missing. Configure using the env. variable YOUTUBE_KEY or the kodi-hosts.config.js.');
    }

    // Search youtube
    console.log(`Searching youtube for ${searchString}`);
    const opts = {
        maxResults: 10,
        key: request.config.youtubeKey
    };

    youtubeSearch(searchString, opts, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        // Play first result
        if (results && results.length !== 0) {
            console.log(`Playing youtube video: ${results[0].description}`);
            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    file: `plugin://plugin.video.youtube/?action=play_video&videoid=${results[0].id}`
                }
            });
        }
    });

    sendResponse(ResponseMaker.get("movie-trailer", {}), response);

};

exports.kodiSeek = (request, response) => { // eslint-disable-line no-unused-vars
    let seekForward = request.query.q.trim();

    kodi.Player.Seek({ // eslint-disable-line new-cap
        'playerid': 1, 'value': {
            'seconds': parseInt(seekForward)
        }
    });
};


const getMovieCard = (request, response) => {

    response.json({
            speech: "Voici les informations que j'ai pu trouver",
            messages: [
                {
                    type: "simple_response",
                    platform: "google",
                    textToSpeech: "Voici les informations que j'ai pu trouver"
                },
                {
                    type: "basic_card",
                    platform: "google",
                    title: "Ma Basic Card",
                    subtitle: "Un super film",
                    formattedText: "Un petit descriptif de mon film",
                    image: {
                        url: "http://www.cinezik.org/critiques/jaquettes/adopte-un-veuf.jpg"
                    }
                }
            ]
        }
    );

    console.log("get movie card");

};


const sendBodyCardResponse = (bodyCard, response) => {
   let responseJson = {
       speech: bodyCard.speech,
       messages: [
           {
               "type": "simple_response",
               "platform": "google",
               "textToSpeech": bodyCard.speech,
               "displayText": bodyCard.displayText
           },
           {
               type: "basic_card",
               platform: "google",
               title: bodyCard.title,
               subtitle: bodyCard.subtitle,
               formattedText: bodyCard.formattedText,
               image: bodyCard.image

           }
       ]

   };

   response.json(responseJson);
};

// Function to send correctly formatted responses to Dialogflow which are then sent to the user
const sendResponse = (responseToUser, response) => {
    // if the response is a string send it as a response to the user
    if (typeof responseToUser === 'string') {
        let responseJson = {};
        responseJson.speech = responseToUser; // spoken response
        responseJson.displayText = responseToUser; // displayed response
        response.json(responseJson); // Send response to Dialogflow
    } else {
        // If the response to the user includes rich responses or contexts send them to Dialogflow
        let responseJson = {

        };

        // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
        responseJson.speech = responseToUser.speech || responseToUser.displayText;
        responseJson.messages = [{
            "type": "simple_response",
            "platform": "google",
            "textToSpeech": responseToUser.speech || responseToUser.display,
            "displayText": responseToUser.display || responseToUser.speech
        }
        ];


        //responseJson.displayText = responseToUser.displayText || responseToUser.speech;

        // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
        //responseJson.data = responseToUser.richResponses;

        // Optional: add contexts (https://dialogflow.com/docs/contexts)
        responseJson.contextOut = responseToUser.outputContexts;

        response.json(responseJson); // Send response to Dialogflow
    }
};