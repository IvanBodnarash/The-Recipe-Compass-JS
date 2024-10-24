export function showCustomAlert(message, type = "info") {
  const alertBox = document.createElement("div");
  alertBox.classList.add("custom-alert", type);

  const alertMessage = document.createElement("p");
  alertMessage.textContent = message;

  const closeButton = document.createElement("span");
  closeButton.textContent = "x";
  closeButton.classList.add("close-btn");

  closeButton.addEventListener("click", () => {
    hideAlert(alertBox);
  });

  alertBox.appendChild(alertMessage);
  alertBox.appendChild(closeButton);

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.classList.add("show");
  }, 10);

  setTimeout(() => {
    hideAlert(alertBox);
  }, 5000);

  function hideAlert(alertBox) {
    alertBox.classList.remove("show");
    alertBox.classList.add("hide");

    setTimeout(() => {
      alertBox.remove();
    }, 500);
  }
}
