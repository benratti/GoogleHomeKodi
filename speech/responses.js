const data = require('./responses-data.js');

exports.get = (key, params) => {

    let dataResponse = data[key];

    let index = Math.floor(Math.random() * dataResponse.responses.length);

    let speech = dataResponse.responses[index].speech;
    let display = dataResponse.responses[index].display;

    for (i = 0; i < dataResponse.params.length; i++) {

        let paramTag = "$" + dataResponse.params[i] + "$";

        speech = speech.replace(paramTag, params[dataResponse.params[i]]);
        display = display.replace(paramTag, params[dataResponse.params[i]]);
    }

    return { speech: speech, display: display};

};