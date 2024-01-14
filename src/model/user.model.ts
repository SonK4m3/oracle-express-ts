var db = require("../config/driverConnection");

var userSchema = db.model({ table: "users" });

export interface UserModel {
  name: string;
  email: string;
}

export default userSchema;
