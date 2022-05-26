import { arrayify } from 'ethers/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../components/prisma'

export const getServerSideProps = async (params) => {
  let revenueTotal = params.query.revenueTotal;
  try {
    const wholeTable = await prisma.user_wallet.findMany();
    let pointsPerUnique, pointsPerNFT, halfOfTotal, poolForUnique, poolForRegular;

    halfOfTotal = revenueTotal / 2;
    poolForUnique = halfOfTotal / 2;
    poolForRegular = halfOfTotal / 2;
    pointsPerUnique = poolForUnique / 100;
    pointsPerNFT = poolForRegular / 9950;

    loopFunction(wholeTable)

    // wholeTable.forEach(async element => {   
    //   console.log(element.wallet)
    //   // const modify = await prisma.user_wallet.update({
    //   //   where: { wallet: element.wallet },
    //   //   data: { points: parseInt(req.body.new_points) },
    //   // });
    // });

    //get all nfts for each user, make a delay so you don't get blocked! 5 seconds maybe

    // const modify = await prisma.user_wallet.update({
    //   where: { wallet: req.body.wallet },
    //   data: { points: parseInt(req.body.new_points) },
    // });

  } catch (error) {
    prisma.$disconnect()
  }
  async function howManyNFTsUserHas(wallet){
    let opensea_api_url = "https://api.opensea.io/api/v1/assets?format=json&owner="+wallet;
    // opensea_api_url = "http://localhost:9999";

    const api_call = await fetch(opensea_api_url, {
      credentials: 'include',
      method: 'GET',
      headers: {
      'Host': 'api.opensea.io:443:',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
      'sec-ch-ua-mobile': '70',
      'sec-ch-ua-platform': 'Linux',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,ro;q=0.8'
     },
      });
    console.log(api_call)
    const data = await api_call.json();
    var to_return = [];

    if(data.assets){
      if(data.assets.length > 0){
        data.assets.forEach(element => {
          if(element.name.startsWith("Crypto Girl Collectable #")){
            to_return.push(element.image_url);
          }
        });
      }else{
        to_return = "You have no nfts"
      }
    }else{
      to_return = "You have no nfts"
    }
  }
  async function handleUser(user){
    try {
      let newPoints = user.points + 100;

      const modify = await prisma.user_wallet.update({
        where: { wallet: user.wallet },
        data: { points: newPoints },
      });

      howManyNFTsUserHas(user.wallet)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
    } catch (error) {
      console.log('error adding revenue points to database!')
      console.log(error)
    }
  }
  async function loopFunction(wholeTable){
    var count = 0;
    var countTo = wholeTable.length
    const interval = setInterval(() => {
      
      handleUser(wholeTable[count]);
      count = count+1;
      if(count == countTo){
        console.log('clearing...')
        clearInterval(interval)
      }
    }, 3000);
  }

  return {
    props: {tabledata: 'test'}, // will be passed to the page component as props
  }
}

export default function handle(props){

  return (<>Calculate and update points</>)
  
}