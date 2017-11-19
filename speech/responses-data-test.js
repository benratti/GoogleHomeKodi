const responses = require('./responses.js');

QUnit.test("GetReponse should return random value when value " ,(assert) => {

    let response = responses.get("current-movie-details-full",{ year: "2001", title: "Rio", directory: "Benjamin Ratti", hours: "12", minutes: "47" });

    assert.ok( response.speech, "speech value must exist");
    assert.ok( response.display, "display value must exist");

    console.log("speech : " + response.speech);
    console.log("display : " + response.display);


    let expectSpeeches = [
        "Le film que vous regardez est Rio. Il a été réalisé par Benjamin Ratti en 2001. Il se terminera à 12 heures 47",
        "Vous regardez Rio de Benjamin Ratti réalisé en 2001. Il sera fini à 12 heures 47",
        "Vous êtes en train de regarder Rio. Ce film a été réalisé en 2001 par Benjamin Ratti. Il se terminera à 12 heures 47"
    ]

    let expectDisplays = [
        "Le film que vous regardez est Rio. Il a été réalisé par Benjamin Ratti en 2001. Il se terminera à 12:47",
        "Vous regardez Rio de Benjamin Ratti réalisé en 2001. Il sera fini à 12:47",
        "Vous êtes en train de regarder Rio. Ce film a été réalisé en 2001 par Benjamin Ratti. Il se terminera à 12:47"
    ]

    assert.ok(expectSpeeches.contains(response.speech),"le speech ne correspond pas à celui attendu");
    assert.ok(expectDisplays.contains(response.display),"le display ne correspond pas à celui attendu");

});


Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}