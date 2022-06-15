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

interface IReplyInform {
  content: string
}

interface IResReplyInform {
  bbsSeq: number,
  replySeq: number,
  content: string
}


export {
  IInformReq,
  IBoardInform,
  IReplyInform,
  IResReplyInform
  
} ;