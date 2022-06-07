interface IUserData {
  id: number,
  name: string,
  age: number,
  gender: string,
}

interface IUserInform {
  name: string,
  value: string | number | undefined,
  inputType: string,
  selectOption?: string[]
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
  ESortDir
}