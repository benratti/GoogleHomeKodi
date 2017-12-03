module.exports = {
    "current-movie-details-full": {
        params: ["title","year","director","hours","minutes"],
        responses: [
            {
                speech: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $director$. Il se terminera à $hours$ heures $minutes$",
                display: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $director$. Il se terminera à $hours$:$minutes$",

            }, {
                speech: "Le film que vous regardez est $title$. Il a été réalisé par $director$ en $year$. Il se terminera à $hours$ heures $minutes$",
                display: "Le film que vous regardez est $title$. Il a été réalisé par $director$ en $year$. Il se terminera à $hours$:$minutes$",
            }, {
                speech: "Vous regardez $title$ de $director$ réalisé en $year$. Il sera fini à $hours$ heures $minutes$",
                display: "Vous regardez $title$ de $director$ réalisé en $year$. Il sera fini à $hours$:$minutes$"
            }
        ]
    },
    "current-movie-details-lite": {
        params: ["title","year","director"],
        responses: [
            {
                speech: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $director$.",
                display: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $director$.",

            }, {
                speech: "Le film que vous regardez est $title$. Il a été réalisé par $director$ en $year$.",
                display: "Le film que vous regardez est $title$. Il a été réalisé par $director$ en $year$.",
            }, {
                speech: "Vous regardez $title$ de $director$ réalisé en $year$.",
                display: "Vous regardez $title$ de $director$ réalisé en $year$."
            }
        ]
    },
    "current-movie-details-simple": {
        params: ["title"],
        responses: [
            {
                speech: "Vous êtes en train de regarder $title$.",
                display: "Vous êtes en train de regarder $title$",

            }, {
                speech: "Le film que vous regardez est $title$",
                display: "Le film que vous regardez est $title$",
            }, {
                speech: "Vous regardez $title$",
                display: "Vous regardez $title$ "
            }
        ]
    },
    "current-movie-details-error": {
        params: [],
            responses: [
            {
                speech: "Je suis désolé, je n'ai pas réussi à trouver les informations sur le film en cour de lecture",
                display: "Je suis désolé, je n'ai pas réussi à trouver les informations sur le film en cour de lecture",

            }, {
                speech: "Oups, je n'arrive pas à identifier le film que vous regarder. Je m'en excuse",
                display: "Oups, je n'arrive pas à identifier le film que vous regarder. Je m'en excuse",
            }, {
                speech: "J'ai rencontré des difficultés lors de ma recherche sur le film en cour de lecture. Je n'ai donc pas d'informations à vous donner.",
                display: "J'ai rencontré des difficultés lors de ma recherche sur le film en cour de lecture. Je n'ai donc pas d'informations à vous donner."
            }
        ]
    },
    "current-movie-details-no-movie": {
        params: [],
            responses: [
            {
                speech: "Il n'y a actuellement aucun film en cours de lecture sur votre média center.",
                display: "Il n'y a actuellement aucun film en cours de lecture sur votre média center.",

            }, {
                speech: "Aucun film n'est actuellement en train d'être visionné sur votre média center.",
                display: "Aucun film n'est actuellement en train d'être visionné sur votre média center.",
            }, {
                speech: "Je suis confu, mais il ne me semble pas que vous soyez en train de regarder un film.",
                display: "Je suis confu, mais il ne me semble pas que vous soyez en train de regarder un film."
            }
        ]
    },
    "movies-suggestion-list": {
        params: [],
        responses: [
            {
                speech: "J'ai trouvé les films suivants, peut-être vont ils vous intéresser.",
                display: "J'ai trouvé les films suivants, peut-être vont ils vous intéresser.",

            }, {
                speech: "J'ai quelques films à vous proposer.",
                display: "J'ai quelques films à vous proposer."
            }, {
                speech: "Voici les films que je peux vous proposer.",
                display: "Voici les films que je peux vous proposer."
            }, {
                speech: "J'ai trouvé quelques films succeptibles de vous intéresser.",
                display: "J'ai trouvé quelques films succeptibles de vous intéresser."
            }
        ]
    },
    "movie-trailer": {
        params: [],
        responses: [
            {
                speech: "J'ai trouvé cette bande-annonce, elle devrait démarrer d'ici peut de temps",
                display: "J'ai trouvé cette bande-annonce, elle devrait démarrer d'ici peut de temps",

            }, {
                speech: "Voici ce que j'ai pu trouver.",
                display: "Voici ce que j'ai pu trouver."
            }, {
                speech: "êtes vous ? Votre bande-annonce va démarrer d'ici peut de temps.",
                display: "Etes vous ? Votre bande-annonce va démarrer d'ici peut de temps."
            }, {
                speech: "Tada ! C'est parti.",
                display: "C'est parti."
            }
        ]
    },
    "last-movie-not-found": {
        params: [],
        responses: [
            {
                speech: "Oups, je m'excuse, je n'ai pas réussi trouver les deniers films qui ont été ajouté",
                display: "Oups, je m'excuse, je n'ai pas réussi trouver les deniers films qui ont été ajouté",

            }, {
                speech: "Je suis confu, je n'ai pas trouvé les derniers films qui ont été ajouté",
                display: "Je suis confu, je n'ai pas trouvé les derniers films qui ont été ajouté"
            }, {
                speech: "êtes vous prêt ? Votre bande-annonce va démarrer d'ici peut de temps.",
                display: "Etes vous prêt ? Votre bande-annonce va démarrer d'ici peut de temps."
            }, {
                speech: "Tada ! C'est parti.",
                display: "C'est parti."
            }
        ]
    },
    "other-movies": {
        params: [],
        responses: [
            {
                speech: ". et encore d'autres films si vous le souhaitez"

            }, {
                speech: ". et tout plein d'autres à vous proposer",
            }, {
                speech: ". <break time=\"1s\"/>Je m'arrête là sinon vous n'aller jamais regarder votre film"
            }, {
                speech: ". Voilà ! J'espère que vous allez trouver votre bonheur"

            }
        ]
    },
    "active-passtrough":  {
        params: [],
        responses: [
            {
                speech: "Très bien, je laisse faire ce boulot à votre home cinéma"

            }, {
                speech: "Le son est maintenant traité par votre home cinéma",
            }, {
                speech: "Si le home cinéma peut faire mon boulot à ma place, je ne vais pas me plaindre. Je lui laisse faire avec plaisir"
            }, {
                speech: "Très bien, j'arrête sur le champ de m'occuper de l'audio."
            }, {
                speech: "Enfin ! C'est quand même son boulot à la base. Je vais pouvoir me reposer un peu."
            }, {
                speech: "Votre home cinéma s'occupe à présent du traitement de l'audio."

            }
        ]
    },
    "desactive-passtrough":  {
        params: [],
        responses: [
            {
                speech: "Très bien, je fais le nécessaire"
            }, {
                speech: "Le son est maintenant traité par votre serviteur"
            }, {
                speech: "Si le home cinéma peut faire mon boulot à ma place, je ne vais pas me plaindre. Je lui laisse faire avec plaisir"
            }, {
                speech: "Très bien, je m'occupe sur le champ du traitement de l'audio."
            }, {
                speech: "Comment ? C'est quand même le boulot de votre home cinéma à la base. Mais comme vous le souhaiter, je vais faire son boulot."
            }, {
                speech: "Votre home cinéma peut désormais se reposer."
            }
        ]
    },

}