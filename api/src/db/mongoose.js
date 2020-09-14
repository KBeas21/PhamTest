const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL || "http://localhost:3000", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});