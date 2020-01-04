// import { MongoError, MongoClient} from "mongodb";

// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, { useNewUrlParser: true,  useUnifiedTopology: true }, function(err: MongoError, db: MongoClient): void {
//   if (err) throw err;
//   console.log("Database created!");

//   const dbo = db.db("test1");
//   dbo.createCollection("customers", (err, res) => {
//       if (err) throw err;
//       console.log("collection created")
//       db.close();
//   });
// });