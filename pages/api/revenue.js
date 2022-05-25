import { arrayify } from 'ethers/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'

export async function getServerSideProps(context) {
  async function testFunction(){
    setInterval(() => {
      console.log('test')
    }, 200);
  }
  testFunction()
  console.log('server')

  return {
    props: {tabledata: 'test'}, // will be passed to the page component as props
  }
}

export default async function handle(props){

  return (<>test</>)
  if(req.method === "POST"){
    try {
      const wholeTable = await prisma.user_wallet.findMany();
      let total_revenue = req.body.total_revenue;
      let pointsPerUnique, pointsPerNFT;

      // getNFTsForEachUserAndAddPoints(wholeTable)


      //get all nfts for each user, make a delay so you don't get blocked! 5 seconds maybe

      // const modify = await prisma.user_wallet.update({
      //   where: { wallet: req.body.wallet },
      //   data: { points: parseInt(req.body.new_points) },
      // });

      return res.status(200).json({ response: "error" })

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
      return res.status(200).json({ response: "error" })
    }
    
  } else if(req.method === "GET"){
    res.status(201).send("GET")
  }
}