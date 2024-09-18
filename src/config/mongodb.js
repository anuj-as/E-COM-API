import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017/ecomdb";
// const url = "mongodb://localhost:27017/";// if we use without db name then it makes with test name
let client;

export const connectToMongoDB = () => {
  MongoClient.connect(process.env.DB_URL).then(clientInstance => {
    client = clientInstance;
    console.log("MongoDB is connected");
    createCounter(client.db());
    createIndexs(client.db());
  }).catch(err => {
    console.log(err);
  })
}

export const getDB = () => {
  return client.db("ecomdb");
}

export const getClient = () => {
  return client;
}

// export default connectToMongoDB;

const createCounter = async (db) => {
  const existingCounter = await db.collection("counters").findOne({ _id: 'cartItemId' });
  if (!existingCounter) {
    await db.collection("counters").insertOne({ _id: 'cartItemId', value: 0 });
  }
}

const createIndexs = async (db) => {
  try {
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ name: 1, category: -1 });
    await db.collection('products').createIndex({ desc: "text" });
    console.log("indexs are created");
  } catch (err) {
    console.log(err);
  }
}