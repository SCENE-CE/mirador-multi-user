import storage from "../../../utils/storage.ts";
import { AnnotationPageDto } from "../type/type.ts";

export const upsertAnnotationPage = async (annotationPageDto: AnnotationPageDto)=>{
  try{
    const token = storage.getToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/annotation-page`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(annotationPageDto),
    });
    const annotationPageSaved =  await response.json();
    if(annotationPageSaved.length > 0){
      return JSON.parse(annotationPageSaved[0].content);
    } else {
      return [] ;
    }
  }catch(error){
    console.error(error);
  }
}
