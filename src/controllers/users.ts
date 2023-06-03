import { getUserById, updateUserById } from './../db/users';
import express, { Request, Response } from "express";

import { deleteUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400)
        }

        const deleteUser = await deleteUserById(id)
        return res.json(deleteUser)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        const user = await getUserById(id)
        if (!user || !username) {
            return res.sendStatus(400)
        }

        user.username = username
        await user.save()

        return res.sendStatus(200).json(user).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}