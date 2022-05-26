import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../components/prisma'
import parse from 'html-react-parser';
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { ClientOnly } from '../points';

const adminConnected = atomWithStorage('adminConnected', false);
export default function Admin(props){
  const [adminIsConnected, setadminIsConnected] = useAtom(adminConnected);

    function Table(){
        let arrayFromTable = JSON.parse(props.tabledata)
        let stringTableHTML = "<div className='tableContainer'><table className='adminTable'>";
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

        stringTableHTML = stringTableHTML + "</table></div>"
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
                <label className="pragmatica admin_heading">Modify points </label><br/>
                <input type='text' placeholder='Enter wallet' name='wallet' required/>
                <input type='number' placeholder='New points' name='new_points' min='0' required/>
                <button type='submit'>Submit</button>
            </form>
        );
    }

    function Revenue(){
        async function handleRevenue(event){
            event.preventDefault();
            
          fetch('/secret_api_total_revenue?revenueTotal='+event.target.total_revenue.value)
          .then((res) => res.json())
          .then((data) => {
              alert(data)
          })
            // const data = {
            //     total_revenue: event.target.total_revenue.value,
            // }
            // const JSONdata = JSON.stringify(data)
            // const endpoint = '/revenue'
            // const options = {
            //     method: 'POST',
            //     headers: {
            //     'Content-Type': 'application/json',
            //     },
            //     body: JSONdata,
            // }
            // const response = await fetch(endpoint, options)
            // const result = await response.json()
            // if(result.response == "failed" || result.response == "error"){
            //     alert('Failed to add points!')
            // }else{
            //     window.location.reload();
            // }
        }

        return (
            <form onSubmit={handleRevenue}>
                <label>Total revenue from secondary sales: </label><br/>
                <input type='number' placeholder='Enter total revenue' name='total_revenue' min='0' required/>
                <button type='submit'>Submit</button>
            </form>
        )
    }

    function ConnectedAdmin(){
        return (
            <>
                <h1 className="pragmatica admin_heading">Admin page</h1>
                <Table/>
                <ChangePoints/>
                <h2 className="pragmatica admin_heading">Revenue</h2>
                <Revenue />
                <button onClick={()=> setadminIsConnected(false)}>LogOut</button>
            </>
        )
    }
    function NotConnectedAdmin(){
        function connectAdmin(){
            setadminIsConnected(true)
        }
        return (
            <>
                <button onClick={()=> connectAdmin()}>press here to connect</button>
            </>
        )
    }
  return (
      <div className="admin_page_container">

        <ClientOnly>
          {adminIsConnected ? <ConnectedAdmin /> : <NotConnectedAdmin />}
        </ClientOnly>
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
