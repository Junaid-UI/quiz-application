const questionNumber = document.querySelector('h1 span')
const content = document.querySelector('.content')
const nextQuestion = document.querySelector('.next')
const backQuestion = document.querySelector('.back')
const ResetQuestion = document.querySelector('.reset-answer')
const submitQuestion = document.querySelector('.submit')
const finalResult = document.querySelector('.finalResult')
const AttemptQuestion = document.querySelector('.Attempt-question span')
const correctAnswer = document.querySelector('.correct span')
const incorrectAnswer = document.querySelector('.incorrect span')
const close = document.querySelector('.close')
const reAttempt = document.querySelector('.Re-Attempt')
const feedbackBtn = document.querySelector('.Give-feedback')

let attemptedQuestions = new Set(); 

function startingQuestion() {
    Swal.fire({
        title: 'Error!',
        text: 'This is the first question!',
        icon: 'error',
        confirmButtonText: 'Cool'
    })
}
function LastgQuestion() {
    Swal.fire({
        title: 'Error!',
        text: 'No more questions!',
        icon: 'error',
        confirmButtonText: 'Okay'
    })
}

window.addEventListener('load', () => {
    async function getApi() {
        try {

            const data = await fetch('/quiz-application/Api.json')
            const finalData = await data.json()
            let currentQuestionIndex = 0
            
            function displayQuestion(value) {

                questionNumber.innerHTML = value+1

                let allOptions = ''

                finalData.questions[value].options.forEach((option,ind) => {

                    const storedAnswer = getStoredAnswer(value);

                    allOptions += `<div class="option">
                        <input type="radio" id="${ind + 1}" name="${value}" value="${option}" ${storedAnswer === option ? 'checked' : ''}>
                        <label for="${ind + 1}">${option}</label>
                    </div>`
                    
                })


                content.innerHTML = `<p class="Question">${finalData.questions[value].question}</p>
                <div class="options-container">${allOptions}</div>`

                function getStoredAnswer(questionIndex) {
                    return localStorage.getItem(`answer-${questionIndex}`);
                }


                content.addEventListener('change',(e) => {
                    
                    if(e.target.type === 'radio'){
                        const selectedAnswer = e.target.value
                        const questionIndex = e.target.name

                        localStorage.setItem(`answer-${questionIndex}`, selectedAnswer)


                        attemptedQuestions.add(questionIndex);
                        console.log(attemptedQuestions);
                        
                        
                        AttemptQuestion.innerHTML = `${attemptedQuestions.size}/10`
                       

                    }

                    
                })

            }

            displayQuestion(currentQuestionIndex)

            
            


            nextQuestion.addEventListener('click', () => {
                if(currentQuestionIndex < finalData.questions.length -1) {
                    currentQuestionIndex++
                    displayQuestion(currentQuestionIndex)

                    if(currentQuestionIndex == finalData.questions.length -1) {
                        submitQuestion.style.display = 'inline-block'
                    }else {
                        submitQuestion.style.display = 'none'
                    }

                }else {
                    LastgQuestion()
                }
            })


            backQuestion.addEventListener('click', () => {
                if(currentQuestionIndex > 0) {
                    currentQuestionIndex--
                    displayQuestion(currentQuestionIndex)

                }else {
                    startingQuestion()
                }

                if(currentQuestionIndex == finalData.questions.length -1) {
                    submitQuestion.style.display = 'inline-block'
                }else {
                    submitQuestion.style.display = 'none'
                }
            })


            submitQuestion.addEventListener('click', () => {

                let correctCount = 0; 
                let incorrectCount = 0; 

                
                finalData.questions.forEach((question, index) => {
                    const storedAnswer = localStorage.getItem(`answer-${index}`); 
                    if (storedAnswer) {
                        if (storedAnswer === question.correctAnswer) {
                            correctCount++; 
                        } else {
                            incorrectCount++; 
                        }
                    }
                });

                
                correctAnswer.innerHTML = ` &nbsp;( ${correctCount} )`;
                incorrectAnswer.innerHTML = `&nbsp; ( ${incorrectCount} )`;

                finalResult.style.display = "block"
               

            })


            ResetQuestion.addEventListener('click', () => {
                localStorage.clear();
                AttemptQuestion.innerHTML = '0/10';
                currentQuestionIndex = 0; 
                if(currentQuestionIndex == finalData.questions.length -1) {
                    submitQuestion.style.display = 'inline-block'
                }else {
                    submitQuestion.style.display = 'none'
                }
                displayQuestion(currentQuestionIndex)

                attemptedQuestions.clear();
            })


            reAttempt.addEventListener('click', () => {
                finalResult.style.display = "none"
                localStorage.clear();
                AttemptQuestion.innerHTML = '0/10';
                currentQuestionIndex = 0; 
                if(currentQuestionIndex == finalData.questions.length -1) {
                    submitQuestion.style.display = 'inline-block'
                }else {
                    submitQuestion.style.display = 'none'
                }
                displayQuestion(currentQuestionIndex)

                attemptedQuestions.clear();

                
                
            })


            close.addEventListener('click', () => {
                location.href = `/error.html`
                localStorage.clear();
                attemptedQuestions.clear();
            })


            
        } catch (error) {
            console.log(error);
            
        }
        
    }
        
    getApi()
        
        
        

})


