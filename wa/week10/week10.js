let triviaBtn = document.querySelector("#js-new-quote").addEventListener('click', newTrivia);

let current = {
    question: ""
}

const endpoint = "https://api.chucknorris.io/jokes/random";

async function newTrivia(){
    // console.log("Success")

    const questionText = document.querySelector('#js-quote-text');
    const spinner = document.querySelector('#spinner');

    // this wil show the loading spinner a instead of the fact
    spinner.style.display = 'block';
    questionText.textContent = '';

    try{
        const response = await fetch(endpoint);
        if(!response.ok){
            throw Error(response.statusText);
        }
        const json = await response.json();
        // console.log(json);
        displayTrivia(json["value"])
        current.question = json["value"];
        // console.log(current.question);
        // console.log(current.answer);
    }
    catch(err){
        console.log(err);
        alert('Failed to get new trivia')
    }

    setTimeout(() => {
        spinner.style.display = 'none';
    }, 500); // this adds the delay so it looks like it's actually loading
}

function displayTrivia(question){
    setTimeout(() => {
       const questionText = document.querySelector('#js-quote-text');
        questionText.textContent = question;
    }, 500); // this adds the delay so it looks like it's actually loading pt 2 (electric boogaloo)
    
}

newTrivia();