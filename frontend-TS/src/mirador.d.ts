// mirador.d.ts
declare module 'mirador' {
  const Mirador: any;
  export default Mirador;
}

declare module 'mirador-annotation-editor' {
  const annotationPlugins: any;
  export default annotationPlugins;
}

declare module 'mirador-annotation-editor/src/annotationAdapter/LocalStorageAdapter.js' {
  const LocalStorageAdapter: any;
  export default LocalStorageAdapter;
}

declare module 'mirador-annotation-editor-video/src/plugin/MiradorAnnotationEditionVideoPlugin'{
  const miradorAnnotationEditorVideo: any;
  export default miradorAnnotationEditorVideo;
}
