
import express, { Request, Response } from "express"
import { getUserByEmail, createUser } from "../db/users"
import { random, authentication } from "../helpers"


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')
        if (!user || user === null || user.authentication == undefined || user.authentication.salt === undefined) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password)
        if (user.authentication.password !== expectedHash) {
            console.log(expectedHash)
            console.log(user.authentication.password)

            return res.sendStatus(403)
        }

        const salt = random();
        user.authentication.sessinToken = authentication(salt, user._id.toString())
        await user.save()

        res.cookie("TASKAP-AUTH", user.authentication.sessinToken, { domain: "localhost", path: "/" })

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {

    try {
        const { email, password, username } = req.body
        console.log(req.body)
        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password')
        if (existingUser) {
                console.log("user already exist")
            return res.sendStatus(400)
        }


        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        
        return res.status(201).json(user).end();
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }

}
