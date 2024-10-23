import { shortenedImgName } from "./imgDisplayShortener.js";   

export function uploadNewImg() {
  document
    .getElementById("uploadNewImg")
    .addEventListener("change", (event) => {
      console.log("File input changed");
      const file = event.target.files[0];
      const fileNameDisplay = document.getElementById("fileName");
      document.getElementById("selectedImageContainerWrapper").style.display =
        "block";
      console.log(file);

      if (file) {
        const reader = new FileReader();

        const validFileTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/jpg",
          "image/svg",
        ];
        const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

        if (!validFileTypes.includes(file.type)) {
          console.log(
            "Please select a valid image file (JPEG, PNG, GIF, WEBP, JPG, SVG)."
          );
          return;
        }

        if (file.size > maxFileSize) {
          console.log("Please select an image smaller than 2 MB.");
          return;
        }
        reader.onload = function (e) {
          const selectedImageContainer =
            document.getElementById("selectedImage");
          selectedImageContainer.src = e.target.result;

          document.getElementById("selectedImageUrl").value = "";
          fileNameDisplay.textContent = shortenedImgName(file);
        };

        reader.readAsDataURL(file);
      }
    });
}
