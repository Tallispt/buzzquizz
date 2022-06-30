function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

//TELA 1
function listaQuizz() {
  let promise = axios.get(
    'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
  )
  promise
    .catch(err => console.log(err))

    .then(result => {
      document.querySelector(
        '.feed'
      ).innerHTML = `<div class="quizzes-container">
                    <div class="title">Todos os Quizzes</div>
                        <div class="quizzes">
                    </div>
                </div>`

      let quizzIndividual = document.querySelector('.quizzes')
      for (let i = 0; i < result.data.length; i++) {
        quizzIndividual.innerHTML += `<div id="${result.data[i].id}" class="individual-quizz" onclick="abrirQuizz(this)">
                        <img src="${result.data[i].image}" class="cover">
                        <div class="gradient"></div>
                        <p>${result.data[i].title}</p>
                    </div>`
      }
    })
}

function abrirQuizz(elemento) {
  let promise = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${elemento.id}`
  )
  promise
    .catch(err => console.log(err))

    .then(result => {
      let questions = result.data.questions
      document.querySelector('.feed').innerHTML = `<div class="top-image">
                    <img src="${result.data.image}">
                    <div class="darken"></div>
                    <p>${result.data.title}</p>
                </div>
                <div class="feed-quizz">
                    
                </div>`

      for (let i = 0; i < questions.length; i++) {
        document.querySelector(
          '.feed-quizz'
        ).innerHTML += `<div class="question-container">
                        <div class="question" style="background-color: ${
                          questions[i].color
                        }">${questions[i].title}</div>
                        <div class="alternatives-container question${
                          i + 1
                        }"></div>
                    </div>`

        let alternatives = questions[i].answers
        shuffle(alternatives)

        for (let j = 0; j < alternatives.length; j++) {
          document.querySelector(
            `.question${i + 1}`
          ).innerHTML += `<div class="alternative ${alternatives[j].isCorrectAnswer}">
                        <img src='${alternatives[j].image}'>
                        <div class="text">${alternatives[j].text}</div>
                    </div>`
        }
      }

      mostrarResposta()
    })
}

function mostrarResposta() {
  document.querySelector('.feed-quizz').innerHTML += `<div class="resposta">

            <div class="restart" onclick="reiniciar()">Reiniciar Quizz</div>
            <div class="go-back" onclick="listaQuizz()">Voltar para home</div>
        </div>`
}

function reiniciar() {
  //Retirar classes das perguntas respondidas
  //Resetar valores dos pontos

  //Scroll para topo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

listaQuizz()

//TELA 2

//TELA 3
//TELA 3.1

/*document.querySelector('.titulo-pagina').innerHTML =
  '<h1>Comece pelo começo</h1>'
document.querySelector('.enviar-dados').innerHTML =
  '<button onclick="salvarQuiz()">Prosseguir para criar perguntas</button>'
document.querySelector('.formulario').innerHTML += `
        <input
          class="titulo-quizz"
          type="text"
          name=""
          id=""
          placeholder="Título do seu quizz"
        />
        <input
          class="url-quizz"
          type="text"
          name=""
          id=""
          placeholder="URL da imagem do seu quizz"
        />
        <input
          class="qtd-perguntas-quizz"
          type="text"
          name=""
          id=""
          placeholder="Quantidade de perguntas do quizz"
        />
        <input
          class="qtd-niveis-quizz"
          type="text"
          name=""
          id=""
          placeholder="Quantidade de níveis do quizz"
        />
        `

let valorInputTitulo
let valorInputUrl
let valorInputQtdPerguntas
let valorInputQtdNiveis

function criarQuiz() {
  localStorage.title = String(document.querySelector('.titulo-quizz').value)
  valorInputTitulo = localStorage.title

  localStorage.image = String(document.querySelector('.url-quizz').value)
  valorInputUrl = localStorage.image

  localStorage.questions = Number(
    document.querySelector('.qtd-perguntas-quizz').value
  )
  valorInputQtdPerguntas = localStorage.questions

  localStorage.levels = Number(
    document.querySelector('.qtd-niveis-quizz').value
  )
  valorInputQtdNiveis = localStorage.levels
}
function salvarQuiz() {
  criarQuiz()
  if (valorInputTitulo.length < 20 || valorInputTitulo.length > 65) {
    alert('Digite um título com no mínimo 20 caracteres e no máximo 65')
    document.querySelector('.titulo-quizz').value = ''
  } else {
    if (valorInputQtdPerguntas < 3) {
      alert('Escolha no mínimo 3 perguntas')
      document.querySelector('.qtd-perguntas-quizz').value = ''
    } else {
      if (valorInputQtdNiveis < 2) {
        alert('Escolha no mínimo 2 niveis')
        document.querySelector('.qtd-niveis-quizz').value = ''
      } else {
        criarPerguntas()
      }
    }
  }
}

// TELA 3.2

function criarPerguntas() {
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Crie suas perguntas</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarQuiz2()">Prosseguir para criar níveis</button>'
  let qtdPerguntas = localStorage.questions
  for (let i = 0; i < qtdPerguntas; i++) {
    document.querySelector('.formulario').innerHTML += `
        <div class="pergunta${i + 1}" >
          <div class="titulos" onclick="togleMenu(this)">
            <h3>Pergunta${i + 1}</h3>
            <div><img src="imagens/Vector.png" alt=""></div>
          </div>
          <input class="texto-pergunta" type="text" name="" id="" placeholder="Texto da pergunta" />
          <input class="cor-fundo-pergunta" 
            type="text"
            name=""
            id=""
            placeholder="Cor de fundo da pergunta"
          />
          <div class="titulos"><h3>Respostas corretas</h3></div>
          <input class="resposta-correta" type="text" name="" id="" placeholder="Resposta correta" />
          <input class="url-resposta-correta" type="text" name="" id="" placeholder="URL da imagem" />
          <div class="titulos"><h3>Respostas incorretas</h3></div>
          <input class="resposta-incorreta1" type="text" name="" id="" placeholder="Resposta incorreta 1" />
          <input class="url-resposta-incorreta1" type="text" name="" id="" placeholder="URL da imagem 1" />
          <input class="resposta-incorreta2" type="text" name="" id="" placeholder="Resposta incorreta 2" />
          <input class="url-resposta-incorreta2" type="text" name="" id="" placeholder="URL da imagem 2" />
          <input class="resposta-incorreta3" type="text" name="" id="" placeholder="Resposta incorreta 3" />
          <input class="url-resposta-incorreta3" type="text" name="" id="" placeholder="URL da imagem 3" />
          `
  }
}

function togleMenu(menuClicado) {
  let pai = menuClicado.parentNode
  console.log(pai)
  pai.classList.toggle('visivel')
}*/
