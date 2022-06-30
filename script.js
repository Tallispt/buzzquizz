let numberQuestion, questionsRespondidas, points;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function rolagem(element) {
    setTimeout(function () {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }, 2000)
}

//TELA 1
function listaQuizz() {
    points = 0;

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
            window.scroll(0, 0)

            let questions = result.data.questions;
            questionsRespondidas = 0;
            numberQuestion = questions.length;

            document.querySelector('.feed').innerHTML =
                `<div class="top-image">
                    <img src="${result.data.image}">
                    <div class="darken"></div>
                    <p>${result.data.title}</p>
                </div>
                <div class="feed-quizz">
                    
                </div>`

            for (let i = 0; i < numberQuestion; i++) {
                document.querySelector('.feed-quizz').innerHTML +=
                    `<div class="question-container">
                        <div class="question" style="background-color: ${questions[i].color}">${questions[i].title}</div>
                        <div class="alternatives-container question${i + 1}"></div>
                    </div>`

                let alternatives = questions[i].answers;
                shuffle(alternatives)

                for (let j = 0; j < alternatives.length; j++) {
                    document.querySelector(`.question${i + 1}`).innerHTML += `<div class="alternative ${alternatives[j].isCorrectAnswer}" onclick="marcarResposta(this)">
                        <img src='${alternatives[j].image}' class="image on-hover">
                        <div class="text">${alternatives[j].text}</div>
                    </div>`
                }
            }
        })
}


//TELA 2


function marcarResposta(elemento) {
    let answerContainer = elemento.parentNode;
    let allChildren = answerContainer.childNodes;

    if (!answerContainer.classList.contains("respondido")) {
        questionsRespondidas++
        answerContainer.classList.add("respondido");
        elemento.classList.add("selected")

        for (let i = 0; i < allChildren.length; i++) {
            allChildren[i].querySelector('.on-hover').classList.remove('on-hover')

            if (!allChildren[i].classList.contains('selected')) {
                allChildren[i].classList.add('non-selected')
            }
            if (allChildren[i].classList.contains('false')) {
                allChildren[i].querySelector(".text").classList.add('wrong')
            } else allChildren[i].querySelector(".text").classList.add('right')

        }


        if (questionsRespondidas === numberQuestion) {
            toggleResposta();
            let resposta = document.querySelector('.resposta');
            rolagem(resposta);
        } else {
            let nextQuestion = answerContainer.parentNode.nextElementSibling
            rolagem(nextQuestion)
        }
    }

}

function toggleResposta() {
    if (!document.querySelector('.resposta')) {
        document.querySelector('.feed-quizz').innerHTML +=
            `<div class="resposta">
                <div class="restart" onclick="reiniciar()">Reiniciar Quizz</div>
                <div class="go-back" onclick="listaQuizz()">Voltar para home</div>
            </div>`
    } else {
        document.querySelector('.resposta').remove('resposta')
    }

}

function reiniciar() {
    //Resetar valores dos pontos
    points = 0
    questionsRespondidas = 0
    //Retirar classes das perguntas respondidas
    let allQuestionsContainers = document.querySelectorAll('.alternatives-container')
    for (let i = 0; i < allQuestionsContainers.length; i++) {
        allQuestionsContainers[i].classList.remove('respondido')
        let allAlternatives = allQuestionsContainers[i].querySelectorAll('.alternative');

        for (let j = 0; j < allAlternatives.length; j++) {
            let alternativeClasses = allAlternatives[j].classList
            let textClasses = allAlternatives[j].querySelector('.text').classList

            let image = allAlternatives[j].querySelector('.image')

            image.classList.add('on-hover')
            if (alternativeClasses.contains('non-selected')) {
                alternativeClasses.remove('non-selected')
            } else {
                alternativeClasses.remove('selected')
            }

            if (textClasses.contains('wrong')) {
                textClasses.remove('wrong')
            } else {
                textClasses.remove('right')
            }
        }
    }

    //Scroll para topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toggleResposta();
}

listaQuizz();






//TELA 3