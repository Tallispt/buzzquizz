let quizzData, numberQuestion, questionsRespondidas, points, allQuizzes, myQuizzes
let quizzezCriados = []
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

function meusQuizes() {
  //aqui tem q botar a condição se tiver ids armazenados
  if (quizzezCriados) {
    myQuizzes = allQuizzes.filter(itm => quizzezCriados.includes(itm.id))
    document.querySelector(
      '.my-quizzes-container'
    ).innerHTML = `<div class="my-quizz">
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
      quizzIndividual.innerHTML += `<div id="${myQuizzes[i].id}" class="individual-quizz" onclick="abrirQuizz(this)">
            <img src="${myQuizzes[i].image}" class="cover">
            <div class="gradient"></div>
            <p>${myQuizzes[i].title}</p>
        </div>`
    }
  } else {
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

  let promise = axios.get(
    'https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes'
  )

  promise
    .catch(err => console.log(err))

    .then(result => {
      window.scroll(0, 0)

      allQuizzes = result.data
      document.querySelector('.feed').innerHTML = ''
      document.querySelector('.formulario').innerHTML = ''
      document.querySelector('.titulo-pagina').innerHTML = ''
      document.querySelector('.enviar-dados').innerHTML = ''
      document.querySelector('.home').innerHTML = ''
      document.querySelector(
        '.feed'
      ).innerHTML = `<button onclick="toggleMyQuizz()">Toggle meu quizz</button>
                <div class="my-quizzes-container"></div>
                <div class="quizzes-container">
                    <div class="title">Todos os Quizzes</div>
                    <div class="quizzes"></div>
                </div>`


      meusQuizes()

      filteredQuizzes = allQuizzes.filter(itm => !quizzezCriados.includes(itm.id))

      let quizzIndividual = document.querySelector(
        '.quizzes-container .quizzes'
      )
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
                    <div class="question" style="background-color: ${
                      questions[i].color
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

listaQuizz()

//TELA 3
//TELA 3.1
let criarQ = {
  title: '',
  image: '',
  questions: [],
  levels: []
}

let regex = /^#([A-Fa-f0-9]{6})$/
let verificaUrl = /^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/

function criarQuiz() {

  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Comece pelo começo</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarQuiz()">Prosseguir para criar perguntas</button>'
  document.querySelector('.formulario').innerHTML += `
      <div class="form1">
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
      </div>
        `
}

let perguntas
let niveis

function salvarQuiz() {
  let titulo
  let imagem
  let valorInputTitulo = String(document.querySelector('.titulo-quizz').value)
  if (valorInputTitulo.length >= 20 && valorInputTitulo.length <= 65) {
    titulo = String(document.querySelector('.titulo-quizz').value)
  } else {
    return alert('Digite um título com no mínimo 20 caracteres e no máximo 65')
  }
  let valorInputUrl = String(document.querySelector('.url-quizz').value)
  if (verificaUrl.test(valorInputUrl)) {
    imagem = String(document.querySelector('.url-quizz').value)
  } else {
    return alert('Insira uma URL válida')
  }
  let valorInputQtdPerguntas = Number(
    document.querySelector('.qtd-perguntas-quizz').value
  )
  if (valorInputQtdPerguntas >= 3) {
    perguntas = Number(document.querySelector('.qtd-perguntas-quizz').value)
  } else {
    return alert('Escolha no mínimo 3 perguntas')
  }
  let valorInputQtdNiveis = Number(
    document.querySelector('.qtd-niveis-quizz').value
  )
  if (valorInputQtdNiveis >= 2) {
    niveis = Number(document.querySelector('.qtd-niveis-quizz').value)
  } else {
    return alert('Escolha no mínimo 2 niveis')
  }
  criarQ.title = titulo
  criarQ.image = imagem
  criarPerguntas()
}

// TELA 3.2
function criarPerguntas() {
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Crie suas perguntas</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarPerguntas()">Prosseguir para criar níveis</button>'
  for (let i = 0; i < perguntas; i++) {
    document.querySelector('.formulario').innerHTML += `
        <div class="pergunta${i + 1}">
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
          <input class="resposta-incorreta" type="text" name="" id="" placeholder="Resposta incorreta 1" />
          <input class="url-resposta-incorreta" type="text" name="" id="" placeholder="URL da imagem 1" />
          <input class="resposta-incorreta" type="text" name="" id="" placeholder="Resposta incorreta 2" />
          <input class="url-resposta-incorreta" type="text" name="" id="" placeholder="URL da imagem 2" />
          <input class="resposta-incorreta" type="text" name="" id="" placeholder="Resposta incorreta 3" />
          <input class="url-resposta-incorreta" type="text" name="" id="" placeholder="URL da imagem 3" />
          `
  }
}

function togleMenu(menuClicado) {
  let pai = menuClicado.parentNode
  console.log(pai)
  pai.classList.toggle('visivel')
}

function salvarPerguntas() {
  criarQ.questions = []
  let questoes
  let respostasTrue
  let respostasFalse

  for (let i = 0; i < perguntas; i++) {
    let valorPergunta = document.querySelector(
      `.pergunta${i + 1} .texto-pergunta`
    ).value
    let valorCorFundo = String(
      document.querySelector(`.pergunta${i + 1} .cor-fundo-pergunta`).value
    )
    let valorRespostaCorreta = document.querySelector(
      `.pergunta${i + 1} .resposta-correta`
    ).value
    let valorUrlRespostaCorreta = document.querySelector(
      `.pergunta${i + 1} .url-resposta-correta`
    ).value
    let valorRespostaIncorreta = document.querySelector(
      `.pergunta${i + 1} .resposta-incorreta`
    ).value
    let valorUrlRespostaIncorreta = document.querySelector(
      `.pergunta${i + 1} .url-resposta-incorreta`
    ).value

    questoes = {
      title: valorPergunta,
      color: valorCorFundo,
      answers: []
    }
    respostasTrue = {
      text: valorRespostaCorreta,
      image: valorUrlRespostaCorreta,
      isCorrectAnswer: true
    }
    respostasFalse = {
      text: valorRespostaIncorreta,
      image: valorUrlRespostaIncorreta,
      isCorrectAnswer: false
    }

    if (valorPergunta.length >= 20 && regex.test(valorCorFundo)) {
      criarQ.questions.push(questoes)
    } else {
      return alert('INSIRA COR')
    }
    if (
      valorRespostaCorreta !== '' &&
      verificaUrl.test(valorUrlRespostaCorreta)
    ) {
      criarQ.questions[i].answers.push(respostasTrue)
    } else {
      return alert('Preencha os campos corretamente com informações válidas')
    }
    if (
      valorRespostaIncorreta !== '' &&
      verificaUrl.test(valorUrlRespostaIncorreta)
    ) {
      criarQ.questions[i].answers.push(respostasFalse)
    } else {
      return alert('Preencha os campos corretamente com informações válidas')
    }
  }
  mostrarQuiz3()
}

function mostrarQuiz3() {
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Agora, decida os níveis</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarQuiz3()">Finalizar Quizz</button>'
  for (let i = 0; i < 2; i++) {
    document.querySelector('.formulario').innerHTML += `
    <div class="nivel${i + 1}">
    <div class="titulos" onclick="togleMenu(this)">
      <h3>Nível ${i + 1}</h3>
      <div><img src="imagens/Vector.png" alt="" /></div>
    </div>
    <input class="titulo-nivel" type="text" name="" id="" placeholder="Titulo do nível" />
    <input class="qtd-minima-acerto"  type="text" name="" id="" placeholder="% de acerto mínima" />
    <input class="url-nivel"  type="text" name="" id="" placeholder="URL da imagem do nível" />
    <input class="descricao-nivel"  type="text" name="" id="" placeholder="Descrição do nível" />
  </div> `
  }
}

function salvarQuiz3() {
  criarQ.levels = []
  let qtdNiveis

  for (let i = 0; i < 2; i++) {
    let tituloNivel = String(
      document.querySelector(`.nivel${i + 1} .titulo-nivel`).value
    )
    let qtdMinimaAcerto = Number(
      document.querySelector(`.nivel${i + 1} .qtd-minima-acerto`).value
    )
    let urlNivel = String(
      document.querySelector(`.nivel${i + 1} .url-nivel`).value
    )
    let descricaoNivel = String(
      document.querySelector(`.nivel${i + 1} .descricao-nivel`).value
    )

    qtdNiveis = {
      title: tituloNivel,
      image: urlNivel,
      text: descricaoNivel,
      minValue: qtdMinimaAcerto
    }

    if (
      tituloNivel.length >= 10 &&
      qtdMinimaAcerto >= 0 &&
      qtdMinimaAcerto <= 100 &&
      verificaUrl.test(urlNivel) &&
      descricaoNivel.length >= 10
    ) {
      criarQ.levels.push(qtdNiveis)
    } else {
      return alert('Prencha os campos')
    }
  }
  finalizandoQuiz()
}

function finalizandoQuiz() {
  let promise = axios.post(
    'https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes',
    criarQ
  )
  promise.then(quizzCriadoComSucesso)
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Seu, quizz está pronto!</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button class="acessar-quizz" onclick="acessarQuiz()">Acessar Quizz</button>'
  document.querySelector('.home').innerHTML =
    '<button class="listar-quizz" onclick="listaQuizz()">Voltar pra home</button>'
  document.querySelector('.formulario').innerHTML += `
  <img src="imagens/Rectangle 34.png" alt="">   
    `
}

function quizzCriadoComSucesso(resposta) {
  console.log(resposta.data)
  let quizzes = resposta.data.id
  if (localStorage.getItem('quizzes') === null) {
    localStorage.setItem('quizzes', JSON.stringify(quizzes))
  } else {
    localStorage.setItem(
      'quizzes',
      JSON.stringify([JSON.parse(localStorage.getItem('quizzes')), quizzes])
    )
  }

  let converterQuizzCriado = JSON.parse(localStorage.getItem('quizzes'))
  quizzezCriados.push(converterQuizzCriado)
}
