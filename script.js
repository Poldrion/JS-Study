const getRandomNumInRange = (min, max) => {
  const randomNum = (Math.random() * (max - min) + min).toFixed(0);
  return randomNum;
};

const getTask = () => {
  const symbol = Math.random() > 0.5 ? "+" : "-";
  const task = `${getRandomNumInRange(0, 100)} ${symbol} ${getRandomNumInRange(
    0,
    100
  )}`;
  gameState.rightAnswer = eval(task);
  return task;
};

const toggleGameState = () => {
  gameState.taskInProcess = !gameState.taskInProcess;
};

const gameElements = document.getElementById("my_game").children;
const title = gameElements[0];
const userTask = gameElements[1];
const userAnswer = gameElements[2];
const btnGame = gameElements[3];

const gameState = {
  taskInProcess: false,
  rightAnswer: null,
};
const startGameFunc = () => {
  if (!gameState.taskInProcess) {
    title.innerText = "Игра началась!";
    userAnswer.value = null;
    const task = getTask();
    userTask.innerText = task;
    userAnswer.hidden = false;
    btnGame.innerText = "Проверить!";
  } else {
    const isRight = gameState.rightAnswer == userAnswer.value;
    userTask.innerText = userTask.innerText + " = " + gameState.rightAnswer;
    title.innerText = isRight ? "Вы победили!" : "Вы проиграли!";
    btnGame.innerText = "Начать заново!";
  }
  toggleGameState();
};

btnGame.addEventListener("click", startGameFunc);
userAnswer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startGameFunc();
  } else if (e.key === "Escape") {
    userAnswer.blur();
  }
});

const choosedEl = document.querySelectorAll(".choosed_block-container > div");
const counterEl = document.querySelector(".choosed_block span");

const choosedState = {
  countElements: 0,
  setCountValue(value) {
    this.countElements += value;
    counterEl.innerText = this.countElements;
  },
};

const eventFunc = (e) => {
  if (e.target.className === "") {
    e.target.className = "choosed_element";
    choosedState.setCountValue(1);
  } else {
    e.target.className = "";
    choosedState.setCountValue(-1);
  }
};

for (let i = 0; i < choosedEl.length; i++) {
  choosedEl[i].addEventListener("click", eventFunc);
}

const postsBlock = document.querySelector(".posts_block-container");
const showPostsBTN = document.querySelector(".posts_block button");

function addPost(title, body) {
  const postTitle = document.createElement("h3");
  const postBody = document.createElement("span");
  const postItem = document.createElement("p");

  postTitle.innerText = title;
  postBody.innerText = body;

  postItem.append(postTitle, postBody);
  postsBlock.append(postItem);
}

function getPosts() {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((data) => {
      for (item of data) {
        addPost(item.title, item.body);
      }
      console.log(data);
    })
    .catch((err) => console.log(err.message));
}

async function getData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}

async function main() {
  const postsData = await getData();
  let currentPage = 1;
  let rows = 10;

  function displayList(arrData, rowPerPage, page) {
    // const postsEl = document.querySelector(".posts_block-container");
    postsBlock.innerHTML = "";
    page--;

    const start = rowPerPage * page;
    const end = start + rowPerPage;
    const paginatedData = arrData.slice(start, end);

    paginatedData.forEach((element) => {
      // const postEl = document.createElement("div");
      // postEl.classList.add("posts_block-container");
      // postEl.innerText = `${element.title}`;
      addPost(element.title, element.body);
      // postsEl.appendChild(postEl);
    });
  }
  function displayPagination(arrData, rowPerPage) {
    const paginationEl = document.querySelector(".pagination");
    const pagesCount = Math.ceil(arrData.length / rowPerPage);
    const ulEl = document.createElement("ul");
    ulEl.classList.add("pagination__list");

    for (let i = 0; i < pagesCount; i++) {
      const liEl = displayPaginationBTN(i + 1);
      ulEl.appendChild(liEl);
    }
    paginationEl.appendChild(ulEl);
  }
  function displayPaginationBTN(page) {
    const liEl = document.createElement("li");
    liEl.classList.add("pagination__item");
    liEl.innerText = page;

    if (currentPage == page) {
      liEl.classList.add("pagination__item--active");
    }

    liEl.addEventListener("click", () => {
      currentPage = page;
      displayList(postsData, rows, currentPage);

      let currentItemLi = document.querySelector("li.pagination__item--active");
      currentItemLi.classList.remove("pagination__item--active");

      liEl.classList.add("pagination__item--active");
    });
    return liEl;
  }

  displayList(postsData, rows, currentPage);
  displayPagination(postsData, rows);
}
main();
