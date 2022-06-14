interface IUserData {
  id: number,
  name: string,
  age: number,
  gender?: string,
}

interface IUserInform {
  name: string,
  value: string | number | undefined,
  inputType: string,
  selectOption?: string[]
}

interface IBoardInputInform {
  name: string,
  value: string,
  inputType: string
}

interface IBoardInform {
  title: string,
  content: string
}

interface IResBoardInform {
  title: string,
  content: string,
  bbsSeq: number,
  userId: number
}

interface IReplyInform {
  content: string
}

enum ESortType {
  "Id" = "id",
  "Name" = "name",
  "Age" = "age",
}

enum ESortDir {
  "ASC" = "asc",
  "DESC" = "desc",
  "ORIGIN" = "origin"
}

export {
  IUserData,
  IUserInform,
  ESortType,
  ESortDir,
  IBoardInform,
  IReplyInform,
  IResBoardInform,
  IBoardInputInform
}