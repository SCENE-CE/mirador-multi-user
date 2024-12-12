export default class LocalStorageAdapter {
  /** */
  constructor(projectId,annotationPageId) {
    console.log("MMU Sotrage adapter")
    this.projectId = projectId;
    this.annotationPageId = annotationPageId;
  }

  /** */
  async create(annotation) {
    const emptyAnnoPage = {
      id: this.annotationPageId,
      items: [],
      type: 'AnnotationPage',
    };
    const annotationPage = await this.all() || emptyAnnoPage;
    annotationPage.items.push(annotation);


    // TODO upsert annotationPage :
    //  this.projectId, this.annotationPageId, JSON.stringify(annotationPage)



    // When sucessfully saved return annotation page
    return annotationPage;
  }

  /** */
  async update(annotation) {
    const annotationPage = await this.all();
    if (annotationPage) {
      const currentIndex = annotationPage.items.findIndex((item) => item.id === annotation.id);
      annotationPage.items.splice(currentIndex, 1, annotation);

      // TODO upsert annotationPage :
      //  this.projectId, this.annotationPageId, JSON.stringify(annotationPage)

      // When sucessfully saved return annotation page
      return annotationPage;
    }
    return null;
  }

  /** */
  async delete(annoId) {
    const annotationPage = await this.all();
    if (annotationPage) {
      annotationPage.items = annotationPage.items.filter((item) => item.id !== annoId);
    }
    // TODO upsert following info :
    //  this.projectId, this.annotationPageId, JSON.stringify(annotationPage)

    // When sucessfully saved return annotation page
    return annotationPage;
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

    // TODO Get annotationPage from following criteria :
    //  this.projectId, this.annotationPageId

    return annotationPage;
  }
}
