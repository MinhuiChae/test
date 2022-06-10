interface IInformReq{
  id: number,
  name: string,
  age: number,
  gender: string,
}

interface IBoardInform {
  userId: number,
  title: string,
  content: string
}

export {
  IInformReq,
  IBoardInform
} ;