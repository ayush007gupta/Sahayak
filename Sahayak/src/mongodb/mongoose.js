const mongoose=require('mongoose');

// thsi coonect to the given database
// each time require is called in index.js this file run 
mongoose.connect("mongodb://localhost:27017/----db name------",{
    useNewUrlParser:true,
    useCreateIndex:true,
})


