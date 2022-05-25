import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'

export default async function handle(req,res){
  if(req.method === "GET"){
    try {
        let walletFromGet = req.query.wallet;
        if(walletFromGet.length === 42){
          const d = new Date();
          const newUser = await prisma.user_wallet.create({
              data: {
                  wallet: walletFromGet,
                  date: d.getTime(),
              },
          })   
          prisma.$disconnect()
          return res.send('added user!');
        }else{
          prisma.$disconnect()
          return res.send('user wallet invalid');
        }
    } catch (error) {
        prisma.$disconnect()
        return res.send('error! '+error)
    }
  } else if(req.method === "POST"){
    res.status(201).send("POST")
  }
}
