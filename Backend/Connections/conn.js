const mongoose=require("mongoose");
const uri = process.env.ATLAS_DB;
async function main() {
     mongoose.connect(uri)
 
}

module.exports = main;



