import BoardModel from "../model/boardModel";
import BbsModel from "../model/includeSeqModel";
import { ESortDir} from "../enum/index";
import { IBoardInform } from "../interface";

const sortAsAsc = <K extends keyof IBoardInform>(userDatas: IBoardInform[], key: K) => {
  userDatas.sort((a: IBoardInform, b: IBoardInform) => {
    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0; 
  });
}

const sortAsDesc = <K extends keyof IBoardInform>(userDatas: IBoardInform[], key: K) => {
  userDatas.sort((a: IBoardInform, b: IBoardInform) => {
    if(a[key] > b[key]) return -1;
    if(a[key] < b[key]) return 1;
    return 0; 
})}

class boardService {
  boardList: BbsModel[] = [];
  boardPageList: BbsModel[] = [];
  dir: ESortDir = ESortDir.ASC;
  sortType: string = '';
 
  constructor(boardList: BbsModel[]) {
    this.boardList = boardList;
  }

  getBoardList(): BbsModel[] {
    return this.boardList;
  }

  createBoardPageList(countPerPage:any, pageNo:any): void {
    const startItemNo = ((pageNo -1) * countPerPage);
    let endItemNo = (pageNo * countPerPage) -1;

    if(endItemNo > (this.boardList.length -1)) {
      endItemNo = this.boardList.length - 1;
    }
    
    if(startItemNo < this.boardList.length) {
      for(let index = startItemNo; index <= endItemNo; index++) {
        this.boardPageList.push(this.boardList[index]);
      }
    }
  }

  getBoardPageList(): BbsModel[] {
    return this.boardPageList;
  }

  getTotalCount(): number {
    return this.boardList.length;
  }

  getCountInform(countPerPage:any, pageNo:any):void {
    if(countPerPage === undefined || typeof countPerPage === "undefined" || countPerPage === null) {
      countPerPage = 10;
    } else {
      if(countPerPage)
      countPerPage = parseInt(countPerPage);
    }
    if(pageNo === undefined || typeof pageNo === "undefined" || pageNo === null) {
      pageNo = 0;
    } else {
      pageNo = parseInt(pageNo);
    }
  }

  sortBoardList(sortType: string, sortDir: ESortDir) {
    this.sortType = sortType;
    this.dir = sortDir;
    if(sortDir === 'asc') {
      Object.values(this.boardList).map(a => {
        Object.keys(a).find((key) => {
          if(key === sortType) {
            sortAsAsc(this.boardList, key as keyof IBoardInform);
          }
        })
      })
    } else if(sortDir === 'desc') {
      Object.values(this.boardList).map(a => {
        Object.keys(a).find((key) => {
          if(key === sortType) {
            sortAsDesc(this.boardList, key as keyof IBoardInform);
          }
        })
      })
    } 
    return this.boardList;

  }

  findBoardByBbsSeq(paramsSeq: number):BbsModel | undefined {
    const board = this.boardList.find((seq) => seq.bbsSeq === paramsSeq)
    return board;
  }
}

export default boardService;


