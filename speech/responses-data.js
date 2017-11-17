module.exports = {
    currentMovieDetailsFull: {
        params: ["title","year","directory","hours","minutes"],
        responses: [
            {
                speech: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $directory$. Il se terminera à $hours$ heures $minutes$",
                display: "Vous êtes en train de regarder $title$. Ce film a été réalisé en $year$ par $directory$. Il se terminera à $hours$:$minutes$",

            }, {
                speech: "Le film que vous regardez est $title$. Il a été réalisé par $directory$ en $year$. Il se terminera à $hours$ heures $minutes$",
                display: "Le film que vous regardez est $title$. Il a été réalisé par $directory$ en $year$. Il se terminera à $hours$:$minutes$",
            }, {
                speech: "Vous regardez $title$ de $directory$ réalisé en $year$. Il sera fini à $hours$ heures $minutes$",
                display: "Vous regardez $title$ de $directory$ réalisé en $year$. Il sera fini à $hours$:$minutes$"
            }
        ]
    }
}