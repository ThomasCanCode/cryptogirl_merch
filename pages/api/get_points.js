import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


export default async function handle(req,res){
  const prisma = new PrismaClient();
  if(req.method === "GET"){

    try {
      const users = await prisma.user_wallet.findUnique({
        where: {
          wallet: req.query.wallet,
        }
      });

      if(users != undefined){
        return res.status(200).json({ points: users.points })
      }else{
        let url = req.headers.referer.substring(0,7)+req.headers.host+"/api/add_wallet?wallet="+req.query.wallet;
        console.log(url)
        fetch(url)
        return res.status(200).json({ points: "not_found" })
      }

    } catch (error) {
      console.log(error)
      return res.status(200).json({ points: "?" })
    }
    
  } else if(req.method === "POST"){
    res.status(201).send("POST")
  }
}

//   // This function gets called at build time on server-side.
//   // It won't be called on client-side, so you can even do
//   // direct database queries.
//   export async function getStaticProps() {

//     const db = mysql({
//       config: {
//         host: process.env.MYSQL_HOST,
//         port: process.env.MYSQL_PORT,
//         database: process.env.MYSQL_DATABASE,
//         user: process.env.MYSQL_USER,
//         password: process.env.MYSQL_PASSWORD
//       }
//     });
//     return {
//       props: {
//         posts: await mysql.connect(),
//       },
//     }
//   }

// export default function excuteQuery({posts}) {

//   return (
//       <>
//         <h1>API</h1>
//         <h2>{posts}</h2>
//       </>
//   )
// }