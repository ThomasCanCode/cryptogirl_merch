import { isArray } from "tls";

export default async function handle(req,res){
  if(req.method === "GET"){

    try {
      let wallet = req.query.wallet;
      let originals_collectables = "collectables";
      let to_return = await getPointsFromWallet(wallet);
      
      return res.status(200).json(to_return)

    } catch (error) {
      console.log(error)
      return res.status(200).json('Error')
    }
    
  } else if(req.method === "POST"){
    res.status(201).send("POST")
  }
}

// https://ipfs.moralis.io:2053/ipfs/QmYKuv1U1Vp3oBbp31sBb9ceduysiDPhcAHafoLoAF9QQW/89.png
async function getPointsFromWallet(wallet){
  let collectables_contract, originals_contract;
    originals_contract = "0x404144ea75970b25abbb76f767a6f8e0ef3b645e";
    collectables_contract = "0xDa38E3cF623793fa46277773bbC5dEF9AD435c06";

    let collectables_url = "https://deep-index.moralis.io/api/v2/"+wallet+"/nft/"+collectables_contract+"?chain=eth&format=decimal";
    const collectable_call = await fetch(collectables_url, {
      credentials: 'include',
      method: 'GET',
      headers: {
      'Content-Type': 'text/plain',
      'accept': 'application/json',
      'X-API-Key': 'Fz97igCTqsl7bGw9BLrwy53Kd2j8V5nn0l5mu0fPyg41peZIIMfqkdNyKNV5mM70',
    },
  });
  let originals_url = "https://deep-index.moralis.io/api/v2/"+wallet+"/nft/"+originals_contract+"?chain=eth&format=decimal";
  const originals_call = await fetch(originals_url, {
     credentials: 'include',
     method: 'GET',
     headers: {
     'Content-Type': 'text/plain',
     'accept': 'application/json',
     'X-API-Key': 'Fz97igCTqsl7bGw9BLrwy53Kd2j8V5nn0l5mu0fPyg41peZIIMfqkdNyKNV5mM70',
   },
 });

  const collectables = await collectable_call.json();
  const originals = await originals_call.json();

  let collectables_result = [],originals_result = [];
  if(collectables.result != undefined){
    if(collectables.result.length > 0){
      collectables.result.forEach(element => {
        collectables_result.push(element.token_id)
      });
    }
  }
  if(originals.result != undefined){
    if(originals.result.length > 0){
      originals.result.forEach(element => {
        originals_result.push(element.token_id)
      });
    }
  }
  let to_return = {
    "collectables":collectables_result,
    "originals":originals_result
  };

  return to_return;
}