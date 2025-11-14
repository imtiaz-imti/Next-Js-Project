// imtiaza0182373_db_user iroZjm5ESUY8DIvy
// mongodb+srv://imtiaza0182373_db_user:iroZjm5ESUY8DIvy@cluster0.m8mq1cb.mongodb.net/?appName=Cluster0
import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strictQuery',true)
  if(!process.env.MONGODB_URL) return console.log('MONGODB_URL not found')
  if(isConnected)return console.log('Already connected to MongoDB')
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error)
  }    
}

