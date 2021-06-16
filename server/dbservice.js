const mysql = require('mysql')
const dotenv = require('dotenv')
const { connect } = require('http2')
const { response } = require('express')
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
            return {
                id:insertId,
                name:name,
                dateAdded:dateAdded
            }
        }catch(error){
            console.log(error)
        }
    }

    async deleteRowById(id){
        try{
            id = parseInt(id,10)
            let response = await new Promise((resolve,reject)=>{
                const query = 'DELETE FROM names WHERE id = ?;'
                connection.query(query,[id],(err,result)=>{
                    if(err) reject(new Error(err.message))
                    resolve(result.affectedRows)
                })
            })
            console.log(response)
            return response === 1 ? true :false
        }catch(error){
            console.log(error)
            return false
        }
    }

    async updateNameById(id,name){
        try{
            let response = await new Promise ((resolve,reject)=>{
                const query = 'UPDATE names SET name = ? WHERE id = ?;'
                connection.query(query,[name,id],(err,result)=>{
                    if (err) reject(new Error(err.message))
                    resolve(result.affectedRows)
                })
            })
            console.log(response)
            return response === 1 ? true :false
        }catch(error){
            console.log(error)
        }
    }

    async searchRowByName(name){
        try{
            let response = await new Promise((resolve,reject)=>{
                const query = 'SELECT * FROM names WHERE name = ?;'
                connection.query(query,[name],(err,result)=>{
                    if(err) reject(new Error(err.message))
                    resolve(result)
                })
            })
            return response
        }catch(error){
            console.log(error)
        }
    }

}

module.exports = DbService;