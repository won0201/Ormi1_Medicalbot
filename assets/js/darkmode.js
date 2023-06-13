// 다크 모드 토글 버튼
const darkModeToggle = document.getElementById("dark");

// 다크 모드 토글 버튼 클릭 이벤트 처리
darkModeToggle.addEventListener("click", (event) => {
  event.preventDefault(); // submit 이벤트 기본 동작 막기
  toggleDarkMode();
});

// 다크 모드 토글 함수
function toggleDarkMode() {
  const body = document.body;

  // body 요소에 dark-mode 클래스 토글
  body.classList.toggle("dark-mode");

  // dark-mode 클래스 여부에 따라 이미지 변경
  const darkModeImage = document.querySelector("#dark img");
  if (body.classList.contains("dark-mode")) {
    darkModeImage.src = "./assets/img/sun.png";
  } else {
    darkModeImage.src = "./assets/img/moon.png";
  }
}
