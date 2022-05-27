import prisma from '../components/prisma'

export const getServerSideProps = async (params) => {
  let pointsPerUnique, pointsPerNFT, halfOfTotal, poolForUnique, poolForRegular;
  let revenueTotal = params.query.revenueTotal;
  try {
    const wholeTable = await prisma.user_wallet.findMany();

    halfOfTotal = revenueTotal / 2;
    poolForUnique = halfOfTotal / 2;
    poolForRegular = halfOfTotal / 2;
    pointsPerUnique = poolForUnique / 100;
    pointsPerNFT = poolForRegular / 9950;

    loopFunction(wholeTable)

  } catch (error) {
    prisma.$disconnect()
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
    }, 5000);
  }
  async function handleUser(user){
    try {
      let newPoints = 0,user_points_from_collectables = 0, user_points_from_originals = 0;

      user_points_from_collectables = await getPointsFromWallet('collectables',user.wallet);
      user_points_from_originals = await getPointsFromWallet('originals',user.wallet);
      newPoints = user.points + user_points_from_collectables + user_points_from_originals;

      const modify = await prisma.user_wallet.update({//we update points here
        where: { wallet: user.wallet },
        data: { points: newPoints },
      });
      console.log(' ')
      console.log('total points for user '+ newPoints)
      console.log(' ')
      console.log(' ')

    } catch (error) {
      console.log('error adding revenue points to database!')
      console.log(error)
    }
  }


  async function getPointsFromWallet(originals_collectables, wallet){
    let contract_address, total_points, count_of_collectables_uniques, count_of_regular_collectables;
    let collectable_uniques = ['1','2','3','4','5','6','7','8','9','10','11','219','702']
    if(originals_collectables === "originals"){
      contract_address = "0x404144ea75970b25abbb76f767a6f8e0ef3b645e"
    }else if(originals_collectables === "collectables"){
      contract_address = "0xDa38E3cF623793fa46277773bbC5dEF9AD435c06";
    }else{
      throw 'error';
    }
    let opensea_api_url = "https://deep-index.moralis.io/api/v2/"+wallet+"/nft/"+contract_address+"?chain=eth&format=decimal";
    const collectable_call = await fetch(opensea_api_url, {
        credentials: 'include',
        method: 'GET',
        headers: {
        'Content-Type': 'text/plain',
        'accept': 'application/json',
        'X-API-Key': 'Fz97igCTqsl7bGw9BLrwy53Kd2j8V5nn0l5mu0fPyg41peZIIMfqkdNyKNV5mM70',
      },
    });
    const collectable_data = await collectable_call.json();

    count_of_collectables_uniques = 0;
    total_points = 0;
    count_of_regular_collectables = 0;

    if(originals_collectables === "collectables"){
      collectable_data.result.forEach(element => {
        if(collectable_uniques.indexOf(element.token_id) > 0){
          count_of_collectables_uniques++;
          console.log('unique NFT found for wallet '+wallet+" nr of NFT: "+element.token_id)
        }else{//not one of the 13 unique NFTs
          count_of_regular_collectables++;
          console.log('regular NFT found for wallet '+wallet+" nr of NFT: "+element.token_id)
        }
      });
      }else if(originals_collectables === "originals"){
        count_of_collectables_uniques = collectable_data.total;
      }

    total_points = (count_of_collectables_uniques * pointsPerUnique) + (count_of_regular_collectables * pointsPerNFT);//total from collectables
    console.log('finally total '+originals_collectables+' points for user: '+wallet+' is: '+total_points)
    return parseInt(total_points); //total_points
  }

  return {
    props: {tabledata: 'Useless prop'}, // will be passed to the page component as props
  }
}

export default function handle(){
  return (<>Calculate and update points</>)
}