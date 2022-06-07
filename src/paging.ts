class Paging {
  pageNum: number = 0;
  pageSize: number = 0;
  totalPage: number = 0;
  list:any = [];

  constructor(pageSize: number) {
    this.pageSize = pageSize;
  }

  setList(list:any) {
    this.list = list;
    this.totalPage = Math.ceil(this.list.length / this.pageSize);
  }

  paginatedData = (page: any): any[] => {
    this.pageNum = page;
    const start = (this.pageNum -1 )* this.pageSize;
    const end = start + this.pageSize;
    const totalList = this.list.slice(start, end);
    return totalList;
  }
  
  pageCount = (): number => {
    let page = Math.floor(this.list.length / this.pageSize);
    if(this.list.length % this.pageSize > 0) page += 1;
  
    return page;
  }

  isInvalidatePageNum(pageNum:number): boolean {
    if (pageNum <= 0 || pageNum > this.totalPage) return true;
    return false;
  }

  isActiveNextButton = (num: number):boolean => {
    console.log("num", num);
    console.log("this.totalPage", this.totalPage)
    if(num >= this.totalPage ) {
      return false;
    } else {
      return true;
    }
  }

  isActivePrevButton = (num: number):boolean => {
    if(num <= 1) {
      return false;
    } else {
      return true;
    }
  }
 
}





export default Paging;