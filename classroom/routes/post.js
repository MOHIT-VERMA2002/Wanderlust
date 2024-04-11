const express = require("express"); 
const router = express.Router();

// [Posts Routes]
//Index - for [Posts]
router.get("/", (req,res) => {
    res.send("GET for posts");
});

//Show - for [Posts]
router.get("/:id", (req,res) => {
    res.send("GET for post id");
});

//POST - for [Posts]
router.post("/", (req,res) => {
    res.send("POST for posts");
});

//DELETE - for [Posts]
router.delete("/:id", (req,res) => {
    res.send("DELETE for post id");
});

module.exports = router;