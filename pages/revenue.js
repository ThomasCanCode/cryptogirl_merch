import { arrayify } from 'ethers/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export async function getServerSideProps(context) {
  async function testFunction(){
    setInterval(() => {
      console.log('testt')
    }, 2000);
  }
  testFunction()
  console.log('server')

  return {
    props: {tabledata: 'test'}, // will be passed to the page component as props
  }
}

export default async function handle(props){

  return (<>testtt</>)
  
}