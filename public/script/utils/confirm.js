export function showCustomConfirm(message, onConfirm, onCancel) {
    const confirmBox = document.createElement("div");
    confirmBox.classList.add("custom-confirm");
  
    const confirmMessage = document.createElement("p");
    confirmMessage.textContent = message;
  
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");
  
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    confirmButton.classList.add("confirm-btn");
  
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-btn");
  
    confirmButton.addEventListener("click", () => {
      onConfirm();
      confirmBox.remove();
    });
  
    cancelButton.addEventListener("click", () => {
      if (onCancel) onCancel();
      confirmBox.remove();
    });
  
    buttonsContainer.appendChild(confirmButton);
    buttonsContainer.appendChild(cancelButton);
  
    confirmBox.appendChild(confirmMessage);
    confirmBox.appendChild(buttonsContainer);
  
    document.body.appendChild(confirmBox);
  }
  