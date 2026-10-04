const dotenv= require('dotenv');
const connectDatabase= require('./Config/database');

//CONFIG
dotenv.config({path: require('path').join(__dirname, 'Config', 'config.env')});
process.on("uncaughtException", (error) => {
    console.error(`Uncaught exception: ${error.message}`);
    process.exit(1);
});
//Connecting to database
connectDatabase();

const app= require('./app');


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("unhandledRejection", (error) => {
    console.error(`Unhandled rejection: ${error.message}`);
    server.close(() => process.exit(1));
});