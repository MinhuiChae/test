enum EStatusCode {
  "SUCCESS" = 200,
  "DUPLICATE" = 409,
  "WRONGFORMAT" = 403,
  "NOTFOUND" = 404
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
  EStatusCode,
  ESortType,
  ESortDir
}