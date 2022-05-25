import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'


export default async function handle(req,res){
  if(req.method === "GET"){

    try {
      const users = await prisma.user_wallet.findUnique({
        where: {
          wallet: req.query.wallet,
        }
      });

      if(users != undefined){
        prisma.$disconnect()
        return res.status(200).json({ points: users.points })
      }else{
        let url = req.headers.referer.substring(0,7)+req.headers.host+"/api/add_wallet?wallet="+req.query.wallet;
        console.log(url)
        fetch(url)
        prisma.$disconnect()
        return res.status(200).json({ points: "not_found" })
      }

    } catch (error) {
      console.log(error)
      prisma.$disconnect()
      return res.status(200).json({ points: "?" })
    }
    
  } else if(req.method === "POST"){
    res.status(201).send("POST")
  }
}