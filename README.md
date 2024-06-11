# Ultra DataBase (UDB)

This DB uses `fs` to store your data locally in `json` format

## Example Usage - you can add, get, find, delete and update data

```JS
const UDB = require("./udb");
const express = require("express");
const app = express();

app.post("/user", async (req, res) => {
  const users = new UDB("users");
  const addUser = await users.add({
      email: "akinleye@email.com"
  });

  const updateUser = await users.updateById(3, {email: "akinleye@email.com"});

  const deleteUser = await users.delete(2)

  const findUser = await users.findOne({ email: "akinleye@email.com" });

  return res.send(findUser);
});

app.listen(3000);
```