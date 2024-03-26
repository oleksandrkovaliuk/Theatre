import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { fbStorage } from "../firebase";
import { validationOnImgType } from "./validateImgType";

export const uploadEventImg = async (event, eventName) => {
  const pathToEventFolder = ref(fbStorage, `eventsImgs/${eventName}/`);
  const uploadingImg = event.target.files[0];
  const insertImgIntoFolder = ref(
    fbStorage,
    `eventsImgs/${eventName}/${uploadingImg?.name}`
  );

  try {
    if (validationOnImgType(uploadingImg.type)) {
      const res = await listAll(pathToEventFolder);
      if (res.items.length) {
        await Promise.all(res.items.map((item) => deleteObject(item)));
      }

      await uploadBytes(insertImgIntoFolder, uploadingImg);

      const resWithUpdatedImg = await listAll(pathToEventFolder);
      const returnedUrl = await getDownloadURL(resWithUpdatedImg.items[0]);
      return { url: returnedUrl, message: "your img succesfully uploaded" };
    } else {
      return { message: "you cannot upload this type of file" };
    }
  } catch (error) {
    return null;
  }
};
