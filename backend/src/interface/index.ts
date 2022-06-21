import { ESortType} from "../enum/index"

interface IInformReq{
  id: number,
  name: string,
  age: number,
  gender: string,
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
  sortDir?: string, 
  replyList?: IResReplyInform[]
}


export {
  IInformReq,
  IBoardInform,
  IReplyInform,
  IResReplyInform,
  IResInform
} ;