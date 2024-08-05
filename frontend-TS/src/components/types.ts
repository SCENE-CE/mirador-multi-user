export type ListItem = {
  id:number
  name:string
  rights?: string

}

export type SelectorItem = {
  id: "ADMIN" | "EDITOR" | "READER"
  name:  "ADMIN" | "EDITOR" | "READER"
}