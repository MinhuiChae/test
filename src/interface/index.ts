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

export {
  IUserData,
  IUserInform
}