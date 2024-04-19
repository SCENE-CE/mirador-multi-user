// mirador.d.ts
declare module 'mirador' {
  const Mirador: any;
  export default Mirador;
}

declare module 'mirador-annotation-editor' {
  const annotationPlugins: any;
  export default annotationPlugins;
}

declare module 'mirador-annotation-editor/annotationAdapter/LocalStorageAdapter' {
  const LocalStorageAdapter: any;
  export default LocalStorageAdapter;
}
