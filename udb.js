const fs = require("fs");

const loadData = async (dbPath) => {
  try {
    const jsonData = await fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(jsonData);
  } catch {
    await fs.writeFileSync(dbPath, JSON.stringify([]));
    return [];
  }
};

const saveData = async (dbPath, jsonData, data) => {
  try {
    await fs.writeFileSync(dbPath, jsonData);
    // console.log("Saved data");
    return data;
  } catch (error) {
    console.error(`Error saving data`, error);
    return {
      error: true,
    };
  }
};

const saveManyData = async (dbPath, jsonData, data) => {
  try {
    await fs.writeFileSync(dbPath, jsonData);
    //   console.log("Saved data");
    return data;
  } catch (error) {
    console.error(`Error saving data`, error);
    return {
      error: true,
    };
  }
};

const getObjData = (data, obj) => {
  const results = [];
  for (const doc of data) {
    for (const key in obj) {
      if (doc[key] == Object.values(obj)) {
        results.push(doc);
      }
    }
  }

  return results;
};

class UDB {
  constructor(dbName) {
    this.dbName = dbName[dbName.length - 1] == "s" ? dbName : dbName + "s";
  }

  dbName = "";
  data = [];
  dbLength = this.data.length;

  add = async (data) => {
    const dbPath = `db/${this.dbName}.json`;
    // Load existing data
    this.data = await loadData(dbPath);
    // Generate new ID
    const newId = this.data.length + 1;
    // Add new data with ID
    this.data.push({ _id: newId, ...data });
    // Stringify data with optional indentation (2 spaces)
    const jsonData = JSON.stringify(this.data, null, 2);
    // Write data to file
    const savedData = await saveData(dbPath, jsonData, data);
    return savedData;
  };

  get = async () => {
    const dbPath = `db/${this.dbName}.json`;
    // Load existing data
    this.data = await loadData(dbPath);

    return this.data;
  }

  delete = async (id) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
    const findData = this.data.find((item) => item?._id == id);
    if (findData) {
      this.data = this.data.filter((item) => item?._id !== id);
      const savedData = await saveManyData(
        dbPath,
        JSON.stringify(this.data, null, 2),
        { deleted: true }
      );
      return savedData;
    } else {
      return {
        msg: "not-found",
      };
    }
  };

  findById = async (id) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
    const findData = this.data.find((item) => item?._id == id);
    if (findData) {
      return findData;
    } else {
      return {
        msg: "not-found",
      };
    }
  };

  find = async (data) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
    const findData = getObjData(this.data, data);
    if (findData) {
      return findData;
    } else {
      return {
        msg: "not-found",
      };
    }
  };

  findOne = async (data) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
    const findData = getObjData(this.data, data);
    if (findData.length !== 0) {
      return findData[0];
    } else {
      return {
        msg: "not-found",
      };
    }
  };

  updateById = async (id, data) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
    let findData = this.data.find((item) => item?._id == id);
    if (findData) {
      findData = { ...findData, ...data };
      this.data.map((item, i) => {
        if (item?._id == id){
            this.data[i] = findData;
        }
      });

      await saveManyData(
        dbPath,
        JSON.stringify(this.data, null, 2),
        this.data
      );
      return findData;
    } else {
      return {
        msg: "not-found",
      };
    }
  };

  updateAll = async (data) => {
    const dbPath = `db/${this.dbName}.json`;
    this.data = await loadData(dbPath);
      const findData = this.data.map(item => {
        item = {...item, ...data}
      })
      await saveManyData(
        dbPath,
        JSON.stringify(this.data, null, 2),
        this.data
      );
      return findData;
    
  
  };
}

module.exports = UDB;