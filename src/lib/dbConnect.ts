import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void>{
    // for checking the database i.e. if it is already connected or not      
    if (connection.isConnected){
        console.log("ALready connected to database");
        return
    }
    try{
        const db =  await mongoose.connect(process.env.MONGODB_URI || 
            '' , {} )

        connection.isConnected = db.connections[0].readyState

        console.log('DB Connection is Successfull');
    }
    catch(error){
        console.log("Database connection failed" , error);

        process.exit(1)
    }
}

export default dbConnect;