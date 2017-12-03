const request = require("request");

export.findTrailer = (title) => {


    var options = {
        method: 'GET',
        url: 'https://api.themoviedb.org/3/search/movie',
        qs:
            {
                include_adult: 'false',
                page: '1',
                query: title,
                language: 'fr-FR',
                api_key: '9cb5bb6b02566d694cab85f62fb6c950'
            },
        body: '{}'
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });

}