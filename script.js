//TELA 1
function listaQuizz() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
    promise
        .catch(err => console.log(err))

        .then(result => {
            document.querySelector('.feed').innerHTML =
                `<div class="quizzes-container">
                <div class="title">Todos os Quizzes</div>
                    <div class="quizzes">
                </div>
            </div>`

            let quizzIndividual = document.querySelector('.quizzes')
            for (let i = 0; i < result.data.length; i++) {
                quizzIndividual.innerHTML +=
                    `<div class="individual-quizz" onclick="abrirQuizz(this)">
                        <img src="${result.data[i].image}" class="cover">
                        <div class="gradient"></div>
                        <p>${result.data[i].title}</p>
                    </div>`
            }
        })
}

function abrirQuizz(elemento) {
    document.querySelector('.feed').innerHTML = `<button onclick='listaQuizz()'>Voltar</button>`
}

listaQuizz();









//TELA 2









//TELA 3