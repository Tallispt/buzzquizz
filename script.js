function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

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
                    `<div id="${result.data[i].id}" class="individual-quizz" onclick="abrirQuizz(this)">
                        <img src="${result.data[i].image}" class="cover">
                        <div class="gradient"></div>
                        <p>${result.data[i].title}</p>
                    </div>`
            }
        })
}

function abrirQuizz(elemento) {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${elemento.id}`)
    promise
        .catch(err => console.log(err))

        .then(result => {
            let questions = result.data.questions;
            document.querySelector('.feed').innerHTML =
                `<div class="top-image">
                    <img src="${result.data.image}">
                    <div class="darken"></div>
                    <p>${result.data.title}</p>
                </div>
                <div class="feed-quizz">
                    
                </div>`

            for (let i = 0; i < questions.length; i++) {
                document.querySelector('.feed-quizz').innerHTML +=
                    `<div class="question-container">
                        <div class="question" style="background-color: ${questions[i].color}">${questions[i].title}</div>
                        <div class="alternatives-container question${i + 1}"></div>
                    </div>`

                let alternatives = questions[i].answers;
                shuffle(alternatives)

                for (let j = 0; j < alternatives.length; j++) {
                    document.querySelector(`.question${i + 1}`).innerHTML += `<div class="alternative ${alternatives[j].isCorrectAnswer}">
                        <img src='${alternatives[j].image}'>
                        <div class="text">${alternatives[j].text}</div>
                    </div>`
                }

            }

            mostrarResposta();
        })
}

function mostrarResposta() {
    document.querySelector('.feed-quizz').innerHTML +=
        `<div class="resposta">

            <div class="restart" onclick="reiniciar()">Reiniciar Quizz</div>
            <div class="go-back" onclick="listaQuizz()">Voltar para home</div>
        </div>`
}

function reiniciar() {
    //Retirar classes das perguntas respondidas
    //Resetar valores dos pontos

    //Scroll para topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

listaQuizz();









//TELA 2









//TELA 3