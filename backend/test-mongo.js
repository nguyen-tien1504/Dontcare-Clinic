// import dns from 'dns'
// import mongoose from 'mongoose'
// import 'dotenv/config'

// dns.setServers(['8.8.8.8'])

// async function run() {
//   const uri = process.env.MONGODB_URI
//   console.log('MONGODB_URI present:', !!uri)
//   if (!uri) return console.error('MONGODB_URI not set')

//   mongoose.set('debug', true)
//   try {
//     await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
//     console.log('Mongoose connected')
//     await mongoose.connection.close()
//     process.exit(0)
//   } catch (err) {
//     console.error('Connection error:')
//     console.error(err)
//     process.exit(1)
//   }
// }

// run()
