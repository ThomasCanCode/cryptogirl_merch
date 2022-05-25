import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'
import parse from 'html-react-parser';


export default function admin(props){
    function Table(){
        let arrayFromTable = JSON.parse(props.tabledata)
        let stringTableHTML = "<table className='adminTable'>";
        stringTableHTML = stringTableHTML + "<tr><th>Wallet</th><th>Register Date</th><th>Points</th></tr>";

        arrayFromTable.forEach(user => {
            var date = new Date(parseInt(user.date));
            let humanDate = date.toLocaleString();

            stringTableHTML = stringTableHTML + "<tr>";
            stringTableHTML = stringTableHTML + "<td>"+user.wallet+"</td>";
            stringTableHTML = stringTableHTML + "<td>"+humanDate+"</td>";
            stringTableHTML = stringTableHTML + "<td>"+user.points+"</td>";
            stringTableHTML = stringTableHTML + "</tr>";
        });

        stringTableHTML = stringTableHTML + "</table>"
        return parse(stringTableHTML);
    }

    function ChangePoints(){

        async function handleSubmit(event){
            event.preventDefault();
            
            const data = {
                wallet: event.target.wallet.value,
                new_points: event.target.new_points.value,
            }
            const JSONdata = JSON.stringify(data)
            const endpoint = '/api/modify_points'
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.response == "failed" || result.response == "error"){
                alert('Failed to modify!')
            }else{
                window.location.reload();
            }
        }

        return (
            <form onSubmit={handleSubmit}>
                <label>Modify points </label><br/>
                <input type='text' placeholder='Enter wallet' name='wallet' required/>
                <input type='number' placeholder='New points' name='new_points' required/>
                <button type='submit'>Submit</button>
            </form>
        );
    }

    function Revenue(){
        async function handleRevenue(event){
            event.preventDefault();
            
            const data = {
                total_revenue: event.target.total_revenue.value,
            }
            const JSONdata = JSON.stringify(data)
            const endpoint = '/api/revenue'
            const options = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSONdata,
            }
            const response = await fetch(endpoint, options)
            const result = await response.json()
            if(result.response == "failed" || result.response == "error"){
                alert('Failed to add points!')
            }else{
                window.location.reload();
            }
        }

        return (
            <form onSubmit={handleRevenue}>
                <label>Total revenue from secondary sales: </label><br/>
                <input type='number' placeholder='Enter total revenue' name='total_revenue' required/>
                <button type='submit'>Submit</button>
            </form>
        )
    }


  return (
      <div className="admin_page_container">
        <h1 className="pragmatica admin_heading">Admin page</h1>
        <Table/>
        <ChangePoints/>

        <h2 className="pragmatica admin_heading">Revenue</h2>
        <Revenue />

        <p>Then make another form with a field for total revenue + button to trigger adding of points, then for each wallet in db check on opensea how many nfts they have 
        <br/><br/>
        50% go towards the pool party = $50k  (25% 1 of 1&apos;s, 25% Crypto Girl NFT holders) <br/><br/>

        If you own a 1 of 1 NFT, you would receive: 25% of $100k = $25k / 100 = $250.  You would receive $250 / claim 250 points.  
        <br/><br/>
        If you own any Crypto Girl NFT you would receive:  25% of $100k = $25k / 9950 = $2.51 per NFT you owned.  You would receive $2.51 / claim 2.51 points.</p>
      </div>
  )
}

export async function getServerSideProps(context) {
    // fetch user logged state
    // check if user is logged
    // you can use server side redirection or pass "redirect" prop to 
    // the component and redirect on page load


    BigInt.prototype.toJSON = function() {       
        return this.toString()
      }
    const wholeTable = await prisma.user_wallet.findMany()
    let data = JSON.stringify(wholeTable)
    
    return {
      props: {tabledata: data}, // will be passed to the page component as props
    }
  }
