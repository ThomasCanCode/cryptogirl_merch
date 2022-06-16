import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'


export default async function handle(req,res){
  if(req.method === "POST"){
    try {
      const modify = await prisma.user_wallet.update({
        where: { wallet: req.body.wallet },
        data: { points: parseFloat(req.body.new_points) },
      })

      if(modify != undefined){
        prisma.$disconnect()
        return res.status(200).json({ response: "modified" })
      }else{
        console.log('error on line 19 modify_points!')
        prisma.$disconnect()
        return res.status(200).json({ response: "failed" })
      }

    } catch (error) {
      prisma.$disconnect()
      console.log(error)
      return res.status(200).json({ response: "error" })
    }
    
  } else if(req.method === "GET"){
    res.status(201).send("GET")
  }
}