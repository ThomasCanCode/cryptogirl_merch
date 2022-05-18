import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


export default async function handle(req,res){
  const prisma = new PrismaClient();
  if(req.method === "GET"){
    try {
        const d = new Date();
        const newUser = await prisma.user_wallet.create({
            data: {
                wallet: req.query.wallet,
                date: d.getTime(),
            },
        })   
        return res.send('added user!');
    } catch (error) {
        console.log(error)
        return res.send('error! '+error)
    }
  } else if(req.method === "POST"){
    res.status(201).send("POST")
  }
}
