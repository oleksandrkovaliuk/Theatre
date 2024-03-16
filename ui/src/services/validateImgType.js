const imageTypes = [
  "jpeg",
  "jpg",
  "png",
  "gif",
  "bmp",
  "svg",
  "webp",
  "tiff",
  "ico",
  "apng",
  "jxr",
  "wdp",
  "avif",
];
export const validationOnImgType = (type) => {
  console.log(type, "type");
  for (let types of imageTypes) {
    while (type.includes(types)) {
      if (!type.includes(types)) {
        return false;
      }
      return true;
    }
  }
};
