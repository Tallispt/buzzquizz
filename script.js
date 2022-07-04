let quizzData, numberQuestion, questionsRespondidas,
  points, perguntas, niveis, allQuizzes, myQuizzes, filteredQuizzes;
let regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
let verificaUrl = /^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/
let idsLocal = []

let criarQ = {
  title: '',
  image: '',
  questions: [],
  levels: []
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
}

function rolagem(element) {
  setTimeout(function () {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, 2000)
}

function loading() {
  document.querySelector(
    '.feed'
  ).innerHTML = `<img src="loader.gif" class="loader">`
}

function loadIds() {
  idsLocal = JSON.parse(localStorage.getItem('id'))
}

function meusQuizes() {

  if (idsLocal) {
    myQuizzes = allQuizzes.filter(itm => idsLocal.includes(itm.id))
    document.querySelector('.my-quizzes-container').innerHTML =
      `<div class="my-quizz">
            <div class="title-container">
                <div class="title">Seus Quizzes</div>
                <div class="circle-icon" onclick="criarQuiz()">
                    <ion-icon name="add-outline"></ion-icon>
                </div>
            </div>
            <div class="quizzes"></div>
        </div>`

    let quizzIndividual = document.querySelector('.my-quizz .quizzes')
    for (let i = 0; i < myQuizzes.length; i++) {
      quizzIndividual.innerHTML +=
        `<div id="${myQuizzes[i].id}" class="individual-quizz" onclick="abrirQuizz(this)">
            <img src="${myQuizzes[i].image}" class="cover">
            <div class="gradient"></div>
            <p>${myQuizzes[i].title}</p>
        </div>`}
  }
  else {
    document.querySelector(
      '.my-quizzes-container'
    ).innerHTML = `<div class="no-my-quizz">
            <p>Você não criou nenhum quizz ainda :(</p>
            <div class="create-button" onclick="criarQuiz()">Criar Quizz</div>
        </div>`
  }
}

//TELA 1
function listaQuizz() {
  points = 0

  loading()

  let promise = axios.get(
    'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
  )

  promise
    .catch(err => console.log(err))

    .then(result => {
      window.scroll(0, 0)

      allQuizzes = result.data

      document.querySelector('.feed').innerHTML =
        `<div class="my-quizzes-container"></div>
        <div class="quizzes-container">
            <div class="title">Todos os Quizzes</div>
            <div class="quizzes"></div>
        </div>`

      meusQuizes();

      if (idsLocal) {
        filteredQuizzes = allQuizzes.filter(el => !idsLocal.includes(el.id))
      } else filteredQuizzes = allQuizzes

      let quizzIndividual = document.querySelector('.quizzes-container .quizzes')
      for (let i = 0; i < filteredQuizzes.length; i++) {
        quizzIndividual.innerHTML += `<div id="${filteredQuizzes[i].id}" class="individual-quizz" onclick="abrirQuizz(this)">
                        <img src="${filteredQuizzes[i].image}" class="cover">
                        <div class="gradient"></div>
                        <p>${filteredQuizzes[i].title}</p>
                    </div>`
      }
    })
}

function abrirQuizz(elemento) {
  loading()

  let promise = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${elemento.id}`
  )

  promise
    .catch(err => console.log(err))

    .then(result => {
      window.scroll(0, 0)

      quizzData = result.data
      let questions = quizzData.questions
      questionsRespondidas = 0
      numberQuestion = questions.length

      document.querySelector('.feed').innerHTML = `<div class="top-image">
                <img src="${quizzData.image}">
                <div class="darken"></div>
                <p>${quizzData.title}</p>
            </div>
            <div class="feed-quizz"></div>`

      for (let i = 0; i < numberQuestion; i++) {
        document.querySelector(
          '.feed-quizz'
        ).innerHTML += `<div class="question-container">
                    <div class="question" style="background-color: ${questions[i].color
          }">${questions[i].title}</div>
                    <div class="alternatives-container question${i + 1}"></div>
                </div>`

        let alternatives = questions[i].answers
        shuffle(alternatives)

        for (let j = 0; j < alternatives.length; j++) {
          document.querySelector(
            `.question${i + 1}`
          ).innerHTML += `<div class="alternative ${alternatives[j].isCorrectAnswer}" onclick="marcarResposta(this)">
                        <img src='${alternatives[j].image}' class="image on-hover">
                        <div class="text">${alternatives[j].text}</div>
                    </div>`
        }
      }
    })
}

//TELA 2

function marcarResposta(elemento) {
  let answerContainer = elemento.parentNode
  let allChildren = answerContainer.childNodes

  if (!answerContainer.classList.contains('respondido')) {
    questionsRespondidas++
    answerContainer.classList.add('respondido')
    elemento.classList.add('selected')

    elemento.classList.contains('true') ? points++ : null

    for (let i = 0; i < allChildren.length; i++) {
      allChildren[i].querySelector('.on-hover').classList.remove('on-hover')

      if (!allChildren[i].classList.contains('selected')) {
        allChildren[i].classList.add('non-selected')
      }
      if (allChildren[i].classList.contains('true')) {
        allChildren[i].querySelector('.text').classList.add('right')
      } else allChildren[i].querySelector('.text').classList.add('wrong')
    }

    if (questionsRespondidas === numberQuestion) {
      let result = Math.round((points * 100) / numberQuestion)
      toggleResposta(result)
      let resposta = document.querySelector('.resposta')
      rolagem(resposta)
    } else {
      let nextQuestion = answerContainer.parentNode.nextElementSibling
      rolagem(nextQuestion)
    }
  }
}

function toggleResposta(result) {
  let levels = quizzData.levels
  let filteredLevel = levels.filter(el => result >= el.minValue)
  let max = Math.max(...filteredLevel.map(el => Number(el.minValue)))
  let yourLevel = filteredLevel.filter(el => el.minValue === max)[0]
  if (!document.querySelector('.resposta')) {
    document.querySelector('.feed-quizz').innerHTML += `<div class="resposta">
                <div class="result-container">
                    <div class="result-title" style="background-color: #EC362D">${result}% de acerto: ${yourLevel.title}</div>
                    <div class="result">
                        <img class="result-image" src="${yourLevel.image}">
                        <div class="description">${yourLevel.text}</div>
                    </div>
                </div>
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
  let allQuestionsContainers = document.querySelectorAll(
    '.alternatives-container'
  )

  for (let i = 0; i < allQuestionsContainers.length; i++) {
    allQuestionsContainers[i].classList.remove('respondido')
    let allAlternatives =
      allQuestionsContainers[i].querySelectorAll('.alternative')

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
  window.scrollTo({ top: 0, behavior: 'smooth' })
  toggleResposta()
}

//TELA 3
//TELA 3.1

function criarQuiz() {
  document.querySelector('.feed').innerHTML = `
  <div class="titulo-pagina">Comece pelo começo</div>
  <div class="quiz-maker1">
      <form class="formulario">
          <input class="titulo-quizz" type="text" placeholder="Título do seu quizz"/>
          <input class="url-quizz" type="text" placeholder="URL da imagem do seu quizz" />
          <input class="qtd-perguntas-quizz" type="text" placeholder="Quantidade de perguntas do quizz" />
          <input class="qtd-niveis-quizz" type="text" placeholder="Quantidade de níveis do quizz" />
      </form>
  </div>
  <div class="enviar-dados" onclick="salvarQuiz()">Prosseguir para criar perguntas</div>
  <div class="go-back" onclick="listaQuizz()">Cancelar</div>`
}

function salvarQuiz() {

  let valorInputTitulo = String(document.querySelector('.titulo-quizz').value)
  let valorInputUrl = String(document.querySelector('.url-quizz').value)
  let valorInputQtdPerguntas = Number(document.querySelector('.qtd-perguntas-quizz').value)
  let valorInputQtdNiveis = Number(document.querySelector('.qtd-niveis-quizz').value)

  if (valorInputTitulo.length >= 20 && valorInputTitulo.length <= 65) {
    criarQ.title = String(document.querySelector('.titulo-quizz').value)
  } else {
    return alert('Digite um título com no mínimo 20 caracteres e no máximo 65')
  }

  if (verificaUrl.test(valorInputUrl)) {
    criarQ.image = String(document.querySelector('.url-quizz').value)
  } else {
    return alert('Insira uma URL válida')
  }
  if (valorInputQtdPerguntas >= 3) {
    perguntas = Number(document.querySelector('.qtd-perguntas-quizz').value)
  } else {
    return alert('Escolha no mínimo 3 perguntas')
  }
  if (valorInputQtdNiveis >= 2) {
    niveis = Number(document.querySelector('.qtd-niveis-quizz').value)
  } else {
    return alert('Escolha no mínimo 2 niveis')
  }

  criarPerguntas()
}

// TELA 3.2
function criarPerguntas() {
  document.querySelector('.feed').innerHTML =
    `<div class="titulo-pagina">Crie suas perguntas</div>
  <div class="quiz-container"></div>
  <div class="enviar-dados" onclick="salvarPerguntas()">Prosseguir para criar níveis</div>
  <div class="go-back" onclick="listaQuizz()">Cancelar</div>`

  for (let i = 0; i < perguntas; i++) {
    document.querySelector('.quiz-container').innerHTML += `
    <div class="quiz-maker2 pergunta${i + 1}">
        <div class="titulos" onclick="togleMenu(this)">
            <h3>Pergunta ${i + 1}</h3>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <form class="formulario">
            <input class="texto-pergunta" type="text" placeholder="Texto da pergunta" />
            <input class="cor-fundo-pergunta" type="text" placeholder="Cor de fundo da pergunta"/>
        </form>
        <div class="titulos sub-t">Respostas corretas</div>
        <form class="formulario">
            <input class="resposta-correta" type="text" placeholder="Resposta correta" />
            <input class="url-resposta-correta" type="text" placeholder="URL da imagem" />
        </form>
        <div class="titulos sub-t">Respostas incorretas</div>
        <form class="formulario">
            <input class="resposta-incorreta" type="text" placeholder="Resposta incorreta 1" />
            <input class="url-resposta-incorreta" type="text" placeholder="URL da imagem 1" />
            <input class="resposta-incorreta" type="text" placeholder="Resposta incorreta 2" />
            <input class="url-resposta-incorreta" type="text" placeholder="URL da imagem 2" />
            <input class="resposta-incorreta" type="text" placeholder="Resposta incorreta 3" />
            <input class="url-resposta-incorreta" type="text" placeholder="URL da imagem 3" />
        </form>
    </div>`
  }
}

function togleMenu(menuClicado) {
  let pai = menuClicado.parentNode
  let icon = menuClicado.querySelector('ion-icon')
  pai.classList.toggle('visivel')
  icon.classList.toggle('hidden')
}

function salvarPerguntas() {

  let questoes = Array(perguntas)

  for (let i = 0; i < perguntas; i++) {
    let questao = {
      title: '',
      color: '',
      answers: []
    }

    let respostasTrue = {
      text: '',
      image: '',
      isCorrectAnswer: true
    }

    let respostasFalse = {
      text: '',
      image: '',
      isCorrectAnswer: false
    }

    let valorPergunta = document.querySelector(`.pergunta${i + 1} .texto-pergunta`).value
    let valorCorFundo = String(document.querySelector(`.pergunta${i + 1} .cor-fundo-pergunta`).value)
    let valorRespostaCorreta = document.querySelector(`.pergunta${i + 1} .resposta-correta`).value
    let valorUrlRespostaCorreta = document.querySelector(`.pergunta${i + 1} .url-resposta-correta`).value
    let questoesIncorrestas = document.querySelectorAll(`.pergunta${i + 1} .resposta-incorreta`)
    let urlQuestoesincorrestas = document.querySelectorAll(`.pergunta${i + 1} .url-resposta-incorreta`)
    let valorRespostaIncorreta = questoesIncorrestas[0].value
    let valorUrlRespostaIncorreta = urlQuestoesincorrestas[0].value

    if (valorPergunta.length >= 20) {
      questao.title = valorPergunta
    } else return alert(`Insira um texto válido na pergunta ${i + 1}`)

    if (regex.test(valorCorFundo)) {
      questao.color = valorCorFundo
    } else return alert(`Insira uma cor de fundo válida na pergunta ${i + 1}`)

    if (valorRespostaCorreta !== '') {
      respostasTrue.text = valorRespostaCorreta
    } else return alert(`Insira a resposta correta na pergunta ${i + 1}`)

    if (verificaUrl.test(valorUrlRespostaCorreta)) {
      respostasTrue.image = valorUrlRespostaCorreta
    } else return alert(`Insira uma URL válida na pergunta ${i + 1}`)

    if (valorRespostaIncorreta !== '') {
      respostasFalse.text = valorRespostaIncorreta
    } else return alert(`Insira no mínimo uma resposta incorreta na pergunta ${i + 1}`)

    if (verificaUrl.test(valorUrlRespostaIncorreta)) {
      respostasFalse.image = valorUrlRespostaIncorreta
    } else return alert(`Insira no mínimo uma URL válida para a pergunta incorreta 1 na pergunta ${i + 1}`)

    questao.answers.push(respostasTrue)
    questao.answers.push(respostasFalse)

    //Caso tenham mais respostas incorretas
    for (let j = 1; j < 3; j++) {
      valorRespostaIncorreta = questoesIncorrestas[j].value
      valorUrlRespostaIncorreta = urlQuestoesincorrestas[j].value

      if (valorRespostaIncorreta == ! '') {
        if (verificaUrl.test(valorUrlRespostaIncorreta)) {
          respostasFalse.text = valorRespostaIncorreta
          respostasFalse.image = valorUrlRespostaIncorreta
          questao.answers.push(respostasFalse)
        } else {
          return alert(`Insira no mínimo uma URL válida para a pergunta incorreta ${j + 1} na pergunta ${i + 1}`)
        }
      }
    }

    questoes[i] = questao
  }

  criarQ.questions = questoes
  criarNivel()
}

// TELA 3.3
function criarNivel() {
  document.querySelector('.feed').innerHTML =
    `<div class="titulo-pagina">Agora, decida os níveis</div>
        <div class="quiz-container"></div>
        <div class="enviar-dados" onclick="salvarNiveis()">Finalizar Quizz</div>
        <div class="go-back" onclick="listaQuizz()">Cancelar</div>`

  for (let i = 0; i < niveis; i++) {
    document.querySelector('.quiz-container').innerHTML +=
      `<div class="quiz-maker2 nivel${i + 1}">
                  <div class="titulos" onclick="togleMenu(this)">
                      <p>Nível ${i + 1}</p>
                      <ion-icon name="create-outline"></ion-icon>
                  </div>
                  <form class="formulario">
                      <input class="titulo-nivel" type="text" placeholder="Título do nível" />
                      <input class="qtd-minima-acerto" type="text" placeholder="% de acerto mínima" />
                      <input class="url-nivel" type="text" placeholder="URL da imagem do nível" />
                      <input class="descricao-nivel" type="text" placeholder="Descrição do nível" />
                  </form>
              </div>`
  }
}

function salvarNiveis() {

  let arrQtdNiveis = Array(niveis)

  for (let i = 0; i < niveis; i++) {
    let qtdNiveis = {
      title: '',
      image: '',
      text: '',
      minValue: ''
    }

    let tituloNivel = String(document.querySelector(`.nivel${i + 1} .titulo-nivel`).value)
    let qtdMinimaAcerto = Number(document.querySelector(`.nivel${i + 1} .qtd-minima-acerto`).value)
    let urlNivel = String(document.querySelector(`.nivel${i + 1} .url-nivel`).value)
    let descricaoNivel = String(document.querySelector(`.nivel${i + 1} .descricao-nivel`).value)

    if (tituloNivel.length >= 10) {
      qtdNiveis.title = tituloNivel
    } else return alert(`Insira ao menos 10 caracteres no nivel${i + 1}`)

    if (qtdMinimaAcerto > 0 && qtdMinimaAcerto <= 100) {
      qtdNiveis.minValue = qtdMinimaAcerto
    } else return alert(`A quantidade minima de acerto tem que ser maior que 0%`)

    if (verificaUrl.test(urlNivel)) {
      qtdNiveis.image = urlNivel
    } else return alert(`Insira uma URL válida no nivel ${i + 1}`)

    if (descricaoNivel.length >= 10) {
      qtdNiveis.text = descricaoNivel
    } else return alert(`Insira ao menos 30 caracteres no nivel ${i + 1}`)

    arrQtdNiveis[i] = qtdNiveis
  }

  criarQ.levels = arrQtdNiveis
  postQuiz()
}

function postQuiz() {
  loading();

  let promise = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes', criarQ)
  promise.then(result => {
    data = result.data
    idsLocal ? idsLocal.push(data.id) : idsLocal = [data.id]
    localStorage.setItem('id', JSON.stringify(idsLocal))
    finalizandoQuiz(data);
  }).catch(err => console.log(err))
}

// TELA 3.4
function finalizandoQuiz(data) {
  document.querySelector('.feed').innerHTML =
    `<div class="titulo-pagina">Seu, quizz está pronto!</div>
    <div class="finalizar-quizz">
      <img src="${data.image}" class="finalizar-cover">
      <div class="finalizar-gradient"></div>
      <p>${data.title}</p>
    </div>
  <div id='${data.id}' class="enviar-dados" onclick="abrirQuizz(this)">Acessar Quizz</div>
  <div class="go-back" onclick="listaQuizz()">Voltar pra home</div>`
}

loadIds()
listaQuizz()


