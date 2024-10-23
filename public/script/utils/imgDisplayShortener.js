export function shortenedImgName(file) {
    const fileName = file.name;
    const fileNameParts = fileName.split(".");
    const name = fileNameParts.slice(0, -1).join(".");
    const extension = fileNameParts.pop();

    let fileNameDisplay;

    if (fileName.length > 20) {
      const shortenedFileName = name.substring(0, 22) + "..." + extension;
      fileNameDisplay = shortenedFileName;
      console.log("Shortened file name:", shortenedFileName);
    } else {
      fileNameDisplay = fileName;
    }

    console.log("File name length:", fileName.length);
    return fileNameDisplay;
  }