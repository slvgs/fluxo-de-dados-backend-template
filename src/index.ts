import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        const result = accounts.find((account) => account.id === id)

        if (!result) {
            res.status(404)
            throw new Error("Conta não enconrada. Verifique a id")
        }

        res.status(200).send(result)


    } catch (error: any) {

        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }





})

//Negócio --
//regra: toda id começa com a letra "a"
//caso eu tente buscar uma conta por id
//o que aconteceria se o id de busca não começasse com a letra 'a'

app.delete("/accounts/:id", (req: Request, res: Response) => {
    //validação do erro ("toda id começa com a")
    //definição do status.Code 400
    //disparo

    //recebimento recebe o erro no catch
    //tratamento trata o erro inesperado com o status.Code
    //resposta pra quem fez a requisição com o res.send(erros.message)
    try {

        const id = req.params.id

        if (id[0] !== "a") {
            res.status(400)
            throw new Error("id inválido. Deve iniciar com letra 'a'")

        }




        const accountIndex = accounts.findIndex((account) => account.id === id)

        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
        }

        res.status(200).send("Item deletado com sucesso")

    } catch (error: any) {

        console.log(error)

        if (res.statusCode === 200) {
            res.send(500)
        }
        res.send(error.message)

    }






})

app.put("/accounts/:id", (req: Request, res: Response) => {

    try {


        const id = req.params.id

        const newId = req.body.id as string | undefined
        const newOwnerName = req.body.ownerName as string | undefined
        const newBalance = req.body.balance as number | undefined
        const newType = req.body.type as ACCOUNT_TYPE | undefined

        if (newBalance !== undefined) {
            if (typeof newBalance !== "number") {
                res.status(400)
                throw new Error("balance deve ser um valor numérico")
            }
        }

        if (newBalance < 0) {
            res.status(400)
            throw new Error("balance não pode ser negativo")
        }

        if (newType !== undefined) {
            if (
                newType !== "Platina" &&
                newType !== "Black" &&
                newType !== "Ouro"



            ) {

                res.status(400)
                throw new Error("O tipo deve ser Black, Platina ou Ouro.")


            }

        }

        if(newId !== undefined){
            if(newId[0] !== "a"){
                res.status(400)
                throw new Error("Por regras de negócio deve-se iniciar com a letra 'a', porfavor corrija seu Id")
            }
        }

        if(newOwnerName !== undefined){
            if(newOwnerName.length < 2 ){
                res.status(400)
                throw new Error("Deve-se ter mais de 2 caracteres!")
            }
        }


        const account = accounts.find((account) => account.id === id)

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send("Atualização realizada com sucesso")





    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.send(500)
        }
        res.send(error.message)


    }





})