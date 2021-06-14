const mysql = require('mysql')
const dotenv = require('dotenv')
const { connect } = require('http2')
dotenv.config()

let instance = null


const connection = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USERNAME,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.DB_PORT
})

connection.connect((err)=>{
    if(err){
        console.log(err.message)
    }
    console.log('db ' + connection.state)
})

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService()
    }
    async getAllData(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = 'SELECT * FROM names;'
                connection.query(query,(err,result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result)
                })
            })
            return response
        }catch(error){
            console.log(error)
        }
    }

    async insertNewName(name){
        try{
            const dateAdded = new Date()
            const insertId = await new Promise((resolve,reject)=>{
                const query = 'INSERT INTO names (name,date_added)  VALUES (?,?);'

                connection.query(query,[name,dateAdded],(err,result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result.insertId)
                })
            })
            console.log(insertId)
            return insertId
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = DbService;