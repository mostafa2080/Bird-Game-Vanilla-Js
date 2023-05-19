const container = document.querySelector('.container');
const startBtn = document.querySelector('.startBtn');
const againButtons = document.querySelectorAll('.again');
const userName = window.location.search.split('=')[1];
const welcomePara = document.querySelector('.welcome');
const scoreDisplay = document.querySelector('span#score');
const welcome = document.querySelector('span#name');
const birdsKilled = document.querySelector('span#killed');
const timerDisplay = document.querySelector('span#timer');
const errorName = document.querySelector('#nameError');
let score = 0;
let killed = 0;
let audio = new Audio('../Sound/birds.mp3');
audio.play();

//user Name check
if (userName == undefined || userName == '') {
  location.href = 'login.html';
}
welcomePara.innerText = `Welcome   ${capitalizeUserName(userName)}`;
welcome.innerHTML = `Welcome, ${capitalizeUserName(userName)}`;
/////////////////////////////////////////////////////////////////////////
//Creating Bird Object
class Bird {
  #birdObj;
  constructor() {
    this.#birdObj = document.createElement('img');
    this.position = {};
    this.position.left = -15;
    this.position.top = Math.floor(Math.random() * 80);
    this.#birdObj.style.position = 'absolute';
    this.#birdObj.style.left = '-35%';
    this.#birdObj.style.top = this.position.top + '%';
    this.#birdObj.classList.add('bird');
    this.#birdObj.addEventListener('click', () => {
      this.setScore();
    });
  }
  get birdObj() {
    return this.#birdObj;
  }

  //Moving The Bird
  moveBird(intervalTime) {
    this.myInterval = setInterval(() => {
      if (this.position.left < 110) {
        this.position.left++;
      } else {
        this.position.left = 0;
        this.position.top = Math.floor(Math.random() * 80);
        this.#birdObj.style.top = this.position.top + '%';
      }
      this.birdObj.style.left = this.position.left + '%';
    }, intervalTime);
  }
  //Kill Bird and Increasing Score
  setScore() {
    this.position.left = -15;
    this.birdObj.style.left = this.position.left;
    score++;
    killed++;
    displayScore();
    displayKilled();
  }
}
//Bird Class to create different birds with different sizes and score
class blueBird extends Bird {
  constructor() {
    super();
    this.birdObj.src = '../gameImages/normal2.gif';
    document.body.append(this.birdObj);
    this.birdObj.style.width = '10%';
    this.birdObj.style.height = '15%';
    this.birdObj.style.position = 'absolute';
    this.birdObj.style.left = '-35%';
    this.birdObj.style.top = this.position.top + '%';
    this.moveBird(50);
  }

  setScore() {
    this.position.left = -15;
    this.birdObj.style.left = this.position.left;
    score += 5;
    killed++;
    displayKilled();
    displayScore();
  }
}
//Gold Bird
class goldBird extends Bird {
  constructor() {
    super();
    this.birdObj.src = '../gameImages/goldy.gif';
    this.birdObj.style.width = '5%';
    this.birdObj.style.height = '15%';
    document.body.append(this.birdObj);
    this.moveBird(30);
  }
  setScore() {
    this.position.left = -15;
    this.birdObj.style.left = this.position.left;
    score += 10;
    killed++;
    displayKilled();
    displayScore();
  }
}
//Black Bird
class blackBird extends Bird {
  constructor() {
    super();
    this.birdObj.src = '../gameImages/black.gif';
    this.birdObj.style.width = '20%';
    this.birdObj.style.height = '20%';
    document.body.append(this.birdObj);
    this.moveBird(50);
  }
  //Override of setScore Function to set
  setScore() {
    this.position.left = -35;
    this.birdObj.style.left = this.position.left;
    score -= 10;
    killed++;
    displayKilled();
    displayScore();
  }
}

class Bomb {
  #BombObj;
  constructor() {
    this.#BombObj = document.createElement('img');
    this.#BombObj.style.width = '10%';
    this.#BombObj.style.height = '15%';
    this.position = {};
    this.position.top = -15;
    this.#BombObj.src = '../gameImages/source.gif';
    this.position.left = Math.floor(Math.random() * 85);
    this.#BombObj.style.position = 'absolute';
    this.#BombObj.style.top = '-15%';
    this.#BombObj.style.left = this.position.left + '%';
    document.body.append(this.bombObj);

    //Functionality to bomb the birds out and increase the score
    this.#BombObj.addEventListener('click', () => {
      bomb.bombObj.style.display = 'none';
      let birds = document.querySelectorAll('img.bird');
      for (let bird of birds) {
        if (
          parseInt(bird.style.left) + parseInt(bird.style.width) >
            bomb.position.left - 20 &&
          parseInt(bird.style.left) < bomb.position.left + 20 &&
          parseInt(bird.style.top) + parseInt(bird.style.height) >
            bomb.position.top - 20 &&
          parseInt(bird.style.top) < bomb.position.top + 20
        ) {
          bird.click();
        }
      }
    });
  }
  get bombObj() {
    return this.#BombObj;
  }

  moveBomb() {
    setTimeout(() => {
      this.position.left = Math.floor(Math.random() * 85);
      bomb.myInterval = setInterval(() => {
        this.#BombObj.style.left = this.position.left + '%';
        if (bomb.position.top < 110) {
          bomb.position.top++;
        } else {
          bomb.bombObj.style.display = 'inline-block';
          bomb.position.top = -15;
          bomb.position.left = Math.floor(Math.random() * 85);
          bomb.bombObj.style.left = bomb.position.left;
        }
        bomb.bombObj.style.top = bomb.position.top + '%';
      }, 50);
    }, 1000);
  }
}

//////////////////////////////////////////////////////////////////////
displayKilled();
displayScore();
let bomb = new Bomb();
startBtn.addEventListener('click', () => {
  startBtn.remove();
  welcomePara.style.display = 'none';
  let timer = 60;
  let id = setInterval(() => {
    if (timer % 10 == 0) {
      new blackBird();
      new blueBird();
      new goldBird();
    }
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    timerDisplay.innerHTML = `${minutes}:${seconds}`;
    timer--;
    if (timer == 0) {
      let items = document.querySelectorAll('img:not(.finish)');
      items.forEach((item) => {
        item.remove();
      });
      clearInterval(id);
      if (score > 50) {
        document.querySelector('.scoreWin').innerText = `Score :${score}`;
        document.getElementById('winner').style.display = 'block';
      } else {
        document.querySelector('.scoreLose').innerText = `Score :${score}`;
        document.getElementById('loser').style.display = 'block';
      }
    }
  }, 1000);

  bomb.moveBomb();
});

againButtons.forEach((btn) => {
  btn.onclick = () => {
    document.getElementById('winner').style.display = 'none';
    document.getElementById('loser').style.display = 'none';
    startBtn.click();
    killed = 0;
    score = 0;
    displayScore();
    displayKilled();
  };
});

function displayKilled() {
  birdsKilled.innerHTML = `Killed : ${killed}`;
}

function displayScore() {
  scoreDisplay.innerHTML = `Score : ${score}`;
}
function capitalizeUserName(name) {
  let characters = [];
  for (let char of name.split(' ')) {
    characters.push(char[0].toUpperCase() + char.slice(1));
  }
  return characters.join(' ');
}

// function check_name(nameError, _name) {
//   let flag = 0;
//   if (!_name) {
//     nameError.style.visibility = 'visible';
//     nameError.innerHTML = 'Required';
//     flag = 1;
//   } else {
//     nameError.style.visibility = 'hidden';
//   }
//   return flag;
// }
