class Paging {
  pageNum: number = 0;
  pageSize: number = 0;
  list:any = [];

  constructor(pageSize: number) {
    this.pageSize = pageSize;
  }

  setList(list:any) {
    this.list = list;
  }

  paginatedData = (page: any): any[] => {
    this.pageNum = page;
    const start = this.pageNum * this.pageSize,
          end = start + this.pageSize;
    return this.list.slice(start, end);
  }
  
  pageCount = (): number => {
    let page = Math.floor(this.list.length / this.pageSize);
    if(this.list.length % this.pageSize > 0) page += 1;
  
    return page;
  }

  isActiveNextButton = (num: number):boolean => {
    console.log(num)
    console.log(this.pageCount())
    if(num >= this.pageCount() -1 ) {
      return false;
    } else {
      return true;
    }
  }

  isActivePrevButton = (num: number):boolean => {
    if(num === 0) {
      return false;
    } else {
      return true;
    }
  }
 
}





export default Paging;