const mongoose = require("mongoose");

function DbConnect() {
  const DB_URL = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
  //   mongoose.connect(DB_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false,
  //   });
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("DB Connected....");
    })
    .catch((err) => console.log(err));
  //   const db = mongoose.connection;
  //   db.on("error", console.error.bind(console, "connection error:"));
  //   db.once("open", () => {
  //     console.log("DB Connected....");
  //   });
}

module.exports = DbConnect;
