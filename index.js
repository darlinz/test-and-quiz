require('dotenv').config();

const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())

//parse requests of content type -application/json
app.use(express.json())

//parse requests of content typw -application/x-222-form-urlencoded
app.use(express.urlencoded({extended: true}))

//simple route
app.get("/", (req, res) => {
    res.json({message:"Welcome to our quizz api project"})
})

require("./routes/userRoute")(app);
require("./routes/questionsRoute")(app);
require("./routes/quizRoute")(app);

require("./routes/subjectRoute")(app);
require("./routes/resultRoute")(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}.`);
})