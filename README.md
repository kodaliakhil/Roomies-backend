### Step-1: Create a package.json file

Use --> `npm init`

### Step-2: Install express and dotenv

Use --> `npm i express dotenv`

- dotenv is where we store credentials and others sensitive info.

### Step-3: Create server.js and .env files in backend folder and initialize our express and dotenv

- In server.js

```
require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5500

app.get('/',(req,res) =>{
    res.send("Hello from backend")
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
```

### Step-4: install nodemon

- Install nodemon
  `npm i nodemon`
- add these in scripts in package.json

```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
```

- run server.js
  `npm run dev` in terminal

### Step-5: create Routes

- create a file routes.js in backend folder where we write our routes
- Import Router from express
  ```
  const router = require("express").Router();
  //Write routes
  router.get("/", (req, res) => {
  res.send("Hello from backend");
  });
  router.post("/api/send-otp", (req, res) => {
  res.send("Hello from OTP Route");
  });
    module.exports = router;
  ```

### Step-6: Use Routes

-import and use our routes in `server.js`

```
const router = require("./routes");
app.use(router);

```

### Step-7: Create Controllers

- Instead of writing the logic in out `router` file create a `controllers` folder and write the logic in these files
- Here we wrap our methods in a class and export the class

```
class AuthController {

}
module.exports = new AuthController();
```

- Now we use them in out Routes.

```
const authController = require('./controllers/auth-controller');
router.post("/api/send-otp", authController.sendOtp);
```

### Step-8: Create Services

- We can create services which can be used in our `controllers logic`
- For this we create a folder named `services` and write all our services in this folder
- Here again we wrap our methods in a class and export the class

```
const crypto = require("crypto");

class OtpService {
  generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }
  sendBySms() {}
  verifyOtp() {}
}
module.exports = new OtpService();

```
