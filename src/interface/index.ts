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
  title: string,
  class: string
}

interface IReqBoardInform {
  title: string,
  content: string
}

interface IResBoardInform {
  title: string,
  content: string,
  bbsSeq: number,
  userId: number,
  replyCnt?: number
}

interface IReqReplyInform {
  content: string
}

interface IResReplyInform {
  bbsSeq: number,
  replySeq: number,
  content: string,
  userId: number
}

interface IResInform {
  status: number, 
  msg: string , 
  data: IResBoardInform[] | IResBoardInform | IResReplyInform[] | IResReplyInform, 
  totalLength?: number, 
  totalPage?: number, 
  pageSize?: number, 
  pageNum?: number, 
  sortBy?: ESortType, 
  sortDir?: string
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

enum EBoardSortType {
  "BBSSEQ" = "bbsSeq",
  "TITLE" = "title",
  "USERID" = "userId",
}

export {
  IUserData,
  IUserInform,
  ESortType,
  ESortDir,
  IReqBoardInform,
  IReqReplyInform,
  IResBoardInform,
  IBoardInputInform,
  IResReplyInform,
  EBoardSortType,
  IResInform
}