import { upsertAnnotationPage } from "../api/upsertAnnotationPage.ts";
import { gettingAnnotationPage } from "../api/gettingAnnotationPage.ts";

export default class MMUAdapter {
  /** */
  constructor(projectId,annotationPageId) {
    console.log("MMU Storage adapter")
    this.projectId = projectId;
    this.annotationPageId = annotationPageId;
  }

  /** */
  async create(annotation) {
    console.log("CREATE")
    const emptyAnnoPage = {
      id: this.annotationPageId,
      items: [],
      type: 'AnnotationPage',
    };
    const annotationPage = await this.all() || emptyAnnoPage;
    annotationPage.items.push(annotation);
    return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
  }

  /** */
  async update(annotation) {
    const annotationPage = await this.all();
    if (annotationPage) {
      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);
      annotationPage.items.splice(currentIndex, 1, annotation);
      return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
    }
    return null;
  }

  /** */
  async delete(annoId) {
    const annotationPage = await this.all();
    if (annotationPage) {
      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);
    }
    return await upsertAnnotationPage({projectId:this.projectId, annotationPageId: this.annotationPageId, content:JSON.stringify(annotationPage)})
  }

  /** */
  async get(annoId) {
    const annotationPage = await this.all();
    if (annotationPage) {
      return annotationPage.items.find((item) => item.id === annoId);
    }
    return null;
  }

  /** */
  async all() {
    console.log("get all")
    return await gettingAnnotationPage(this.annotationPageId, this.projectId);
  }
}
