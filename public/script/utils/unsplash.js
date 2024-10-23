// Function for searching image with Unsplash API
export async function searchImagesOnUnsplash(query) {
  const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=JRHCGjiEKiwH6NJOTS4GxfGm2K0TvJ5gS-ze_6eJJzg`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results && data.results.length > 0) {
      console.log(data.results[0].urls.regular);
      return data.results; // Return the first image URL
    } else {
      return []; // Return null if no image is found
    }
  } catch (error) {
    console.error("Error searching Unsplash:", error);
    return [];
  }
}

export function displayUnsplashImages(images) {
  const imageContainer = document.getElementById("imageGallery");
  imageContainer.innerHTML = "";
  imageContainer.style.display = "flex";

  images.forEach((image) => {
    const imgElement = document.createElement("img");
    imgElement.src = image.urls.small;
    imgElement.alt = image.alt_description;
    // imgElement.classList.add("gallery-image");

    // Add click event to select image
    imgElement.addEventListener("click", () => {
      selectImage(image.urls.regular);
    });

    imageContainer.appendChild(imgElement);
  });
}

// Handle Unslash Image Selection
function selectImage(imageUrl) {
  const selectedImageContainer = document.getElementById("selectedImage");
  selectedImageContainer.src = imageUrl;

  document.getElementById("selectedImageUrl").value = imageUrl;
  document.getElementById("fileName").textContent = "No File Chosen";
  // document.getElementById("uploadImgButton").value = "";
  document.getElementById("selectedImageContainerWrapper").style.display =
    "block";
}
