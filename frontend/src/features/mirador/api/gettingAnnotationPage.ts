import storage from "../../../utils/storage.ts";

export const gettingAnnotationPage = async (annotationPageId: number, projectId:number)=>{
  try{
    const token = storage.getToken();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/annotation-page/${annotationPageId}/${projectId}`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return await response.json();
  }catch(error){
    console.error(error);
  }
}