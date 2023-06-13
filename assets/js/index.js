const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatContainer = document.getElementById("chat-container");
const chatList = document.getElementById("chat-list");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

let data_function = [
  {
    role: "system",
    content:
      "assistant는 약물의 부작용, 쓰이는 법을 잘 알고, 특별한 요청이 없다면 한국어로 진단을 해주는 의학 전문가이다. 의학적 소견이나 약품 정보를 말해줘야한다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];
let data = [];

// input에 입력된 질문 받아오는 함수
chatInput.addEventListener("input", (e) => {
  question = e.target.value;
});

// 사용자의 질문을 객체로 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = (question) => {
  let li = document.createElement("li");
  li.classList.add("question");

  const questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");

  const userIcon = document.createElement("img");
  userIcon.classList.add("user-icon");
  userIcon.src = "./assets/img/user.png";
  userIcon.alt = "User";

  const questionText = document.createElement("div");
  questionText.classList.add("chat_content");
  questionText.textContent = question;

  questionContainer.appendChild(userIcon);
  questionContainer.appendChild(questionText);
  li.appendChild(questionContainer);
  chatList.appendChild(li);
};

// 화면에 로딩 표시를 보여주는 함수
const showLoadingIndicator = () => {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.classList.add("loading-indicator");
  loadingIndicator.id = "loading-indicator";
  chatContainer.parentNode.insertBefore(loadingIndicator, chatContainer);

  // 채팅 컨테이너에 블러 처리를 추가
  document
    .querySelectorAll(".question-container, .answer-container")
    .forEach((element) => {
      element.classList.add("blur");
    });
};

// 화면에 로딩 표시를 숨기는 함수
const hideLoadingIndicator = () => {
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove();
  }

  // 채팅 컨테이너의 블러 처리를 제거
  document
    .querySelectorAll(".question-container, .answer-container")
    .forEach((element) => {
      element.classList.remove("blur");
    });
};

// API 요청을 보내는 함수
const apiPost = async () => {
  showLoadingIndicator();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      redirect: "follow",
    });

    if (response.ok) {
      const result = await response.json();
      const choices = result.choices.filter(
        (choice) => choice.message.content.trim() !== ""
      );
      if (choices.length > 0) {
        const uniqueAnswers = new Set();
        choices.forEach((choice) => {
          uniqueAnswers.add(choice.message.content);
        });
        const answer = Array.from(uniqueAnswers)[0];
        printAnswer(answer);
      } else {
        printAnswer("죄송합니다. 답변을 찾을 수 없습니다.");
      }
    } else {
      throw new Error("API 요청에 실패했습니다.");
    }
  } catch (error) {
    console.log(error);
    printAnswer("죄송합니다. 오류가 발생했습니다.");
  } finally {
    hideLoadingIndicator();
    data = [];
  }
};

// 챗봇의 인사
const chatbotGreeting = `안녕하세요. 반가워요.`;

// 화면 로딩 시 챗봇의 인사를 출력
window.addEventListener("DOMContentLoaded", () => {
  printAnswer(chatbotGreeting);
});

// 화면에 답변을 그려주는 함수
const printAnswer = (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");

  const answerContainer = document.createElement("div");
  answerContainer.classList.add("answer-container");

  const chatbotImage = document.createElement("img");
  chatbotImage.classList.add("nurse-image");
  chatbotImage.src = "./assets/img/nurse.png";
  chatbotImage.alt = "Chatbot";

  const answerText = document.createElement("div");
  answerText.classList.add("chat_content");
  answerText.textContent = answer;

  answerContainer.appendChild(chatbotImage);
  answerContainer.appendChild(answerText);
  li.appendChild(answerContainer);
  chatList.appendChild(li);

  hideLoadingIndicator();
};

// 대화 추가 함수
function addChat(text, isQuestion) {
  const chatList = document.getElementById("chat-list");
  const chatItem = document.createElement("li");
  chatItem.classList.add(isQuestion ? "question" : "answer");
  chatItem.textContent = text;
  chatList.appendChild(chatItem);
}

// 채팅 폼 제출 이벤트 핸들러
document
  .getElementById("chat-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (message !== "") {
      input.value = "";
      sendQuestion(message);
      printQuestion(message);
      const answer = await apiPost();
      printAnswer(answer);
    }
  });

// input의 keydown 이벤트 핸들러
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (message !== "") {
      chatInput.value = "";
      sendQuestion(message);
      printQuestion(message);
      apiPost();
    }
  }
});

// Submit 이벤트 처리
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  chatInput.value = null;
  sendQuestion(question);
  apiPost();
});
