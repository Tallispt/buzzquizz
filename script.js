function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
  let numberQuestion, questionsRespondidas, points

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
      window.scroll(0, 0)

      let questions = result.data.questions
      questionsRespondidas = 0
      numberQuestion = questions.length

      document.querySelector('.feed').innerHTML = `<div class="top-image">
                    <img src="${result.data.image}">
                    <div class="darken"></div>
                    <p>${result.data.title}</p>
                </div>
                <div class="feed-quizz">
                    
                </div>`

      for (let i = 0; i < numberQuestion; i++) {
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

    for (let i = 0; i < allChildren.length; i++) {
      allChildren[i].querySelector('.on-hover').classList.remove('on-hover')

      if (!allChildren[i].classList.contains('selected')) {
        allChildren[i].classList.add('non-selected')
      }
      if (allChildren[i].classList.contains('false')) {
        allChildren[i].querySelector('.text').classList.add('wrong')
      } else allChildren[i].querySelector('.text').classList.add('right')
    }

    if (questionsRespondidas === numberQuestion) {
      toggleResposta()
      let resposta = document.querySelector('.resposta')
      rolagem(resposta)
    } else {
      let nextQuestion = answerContainer.parentNode.nextElementSibling
      rolagem(nextQuestion)
    }
  }
}

function toggleResposta() {
  if (!document.querySelector('.resposta')) {
    document.querySelector('.feed-quizz').innerHTML += `<div class="resposta">
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

//TELA 2

//TELA 3
//TELA 3.1
let regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
let verificaUrl = /^[a-zA-Z0-9-_]+[:./\\]+([a-zA-Z0-9 -_./:=&"'?%+@#$!])+$/
let objeto = {
  id: '',
  title: '',
  image: '',
  questions: [
    {
      title: '',
      color: '',
      answers: [
        {
          text: '',
          image: '',
          isCorrectAnswer: ''
        },
        {
          text: '',
          image: '',
          isCorrectAnswer: ''
        }
      ]
    }
  ]
}

let valorInputTitulo
let valorInputUrl
let valorInputQtdPerguntas
let valorInputQtdNiveis

function criarQuiz() {
  document.querySelector('.titulo-pagina').innerHTML =
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
        if (verificaUrl.test(valorInputUrl) == false) {
          alert('Insira uma URL válida')
          document.querySelector('.url-quizz').value = ''
        } else {
          criarPerguntas()
        }
      }
    }
  }
}

// TELA 3.2
let qtdPerguntas
function criarPerguntas() {
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Crie suas perguntas</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarQuiz2()">Prosseguir para criar níveis</button>'
  qtdPerguntas = localStorage.questions
  for (let i = 0; i < qtdPerguntas; i++) {
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
  let textoPergunta = []
  let corFundo = []
  let respostaCorreta = []
  let urlRespostaCorreta = []
  let respostaIncorreta = []
  let urlRespostaIncorreta = []
  for (let i = 0; i < qtdPerguntas; i++) {
    let valorPergunta = document.querySelector(
      `.pergunta${i + 1} .texto-pergunta`
    ).value
    console.log(valorPergunta.length)
    if (valorPergunta.length >= 20) {
      textoPergunta.push(valorPergunta)
    } else {
      return alert(`Insira um texto válido na pergunta ${i + 1}`)
    }
    console.log(textoPergunta)
    let valorCorFundo = String(
      document.querySelector(`.pergunta${i + 1} .cor-fundo-pergunta`).value
    )
    if (regex.test(valorCorFundo)) {
      corFundo.push(valorCorFundo)
    } else {
      return alert(`Insira uma cor de fundo válida na pergunta ${i + 1}`)
    }
    console.log(corFundo)
    let valorRespostaCorreta = document.querySelector(
      `.pergunta${i + 1} .resposta-correta`
    ).value
    if (valorRespostaCorreta !== '') {
      respostaCorreta.push(valorRespostaCorreta)
    } else {
      return alert(`Insira a resposta correta na pergunta ${i + 1}`)
    }
    console.log(respostaCorreta)

    let valorUrlRespostaCorreta = document.querySelector(
      `.pergunta${i + 1} .url-resposta-correta`
    ).value
    if (verificaUrl.test(valorUrlRespostaCorreta)) {
      urlRespostaCorreta.push(valorUrlRespostaCorreta)
    } else {
      return alert(`Insira uma URL válida na pergunta ${i + 1}`)
    }
    console.log(urlRespostaCorreta)

    let valorRespostaIncorreta = document.querySelector(
      `.pergunta${i + 1} .resposta-incorreta`
    ).value
    if (valorRespostaIncorreta !== '') {
      respostaIncorreta.push(valorRespostaIncorreta)
    } else {
      return alert(
        `Insira no mínimo uma resposta incorreta na pergunta ${i + 1}`
      )
    }
    console.log(respostaIncorreta)

    let valorUrlRespostaIncorreta = document.querySelector(
      `.pergunta${i + 1} .url-resposta-incorreta`
    ).value
    if (verificaUrl.test(valorUrlRespostaIncorreta)) {
      urlRespostaIncorreta.push(valorUrlRespostaIncorreta)
    } else {
      return alert(
        `Insira no mínimo uma URL válida para a pergunta incorreta na pergunta ${
          i + 1
        }`
      )
    }
    console.log(urlRespostaIncorreta)
  }
}

function salvarQuiz2() {
  salvarPerguntas()
  mostrarQuiz3()
}

function mostrarQuiz3() {
  document.querySelector('.formulario').innerHTML = ''
  document.querySelector('.titulo-pagina').innerHTML =
    '<h1>Agora, decida os níveis</h1>'
  document.querySelector('.enviar-dados').innerHTML =
    '<button onclick="salvarQuiz3()">Finalizar Quizz</button>'
  for (let i = 0; i < localStorage.levels; i++) {
    document.querySelector('.formulario').innerHTML += `
    <div class="nivel${i + 1}">
    <div class="titulos" onclick="togleMenu(this)">
      <h3>Nível ${i + 1}</h3>
      <div><img src="imagens/Vector.png" alt="" /></div>
    </div>
    <input type="text" name="" id="" placeholder="Titulo do nível" />
    <input type="text" name="" id="" placeholder="% de acerto mínima" />
    <input type="text" name="" id="" placeholder="Resposta correta" />
    <input type="text" name="" id="" placeholder="URL da imagem" />
    <input type="text" name="" id="" placeholder="Resposta incorreta 1" />
  </div> `
  }
}
