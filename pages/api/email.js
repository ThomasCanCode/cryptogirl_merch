import { SMTPClient } from 'emailjs';
import prisma from '../../components/prisma'
 
export default async function handler(req, res) {
 
 const data=req.body;
 

 const client = new SMTPClient({
   user: process.env.mail,
   password: process.env.emailpassword,
   host: 'SMTP.titan.email',
   ssl:true
 });

 let message_text = "Name: "+data.name+"\r\n";
 message_text +=  "Address: "+data.address+"\r\n";
 message_text +=  "Email: "+data.email+"\r\n";
 message_text +=  "Extra: "+data.extra+"\r\n";
 message_text +=  "Cart: "+data.cart+"\r\n";

 if(typeof data.hash != "undefined"){
    message_text +=  "Transaction Hash to check: "+data.hash+"\r\n";
 }
 
 const newUser = await prisma.orders.create({
    data: {
        user_info: data.name+" "+data.address+" "+data.email+" "+data.extra,
        order_info: data.cart.toString(),
    },
})   
prisma.$disconnect()
 
 try{
    const message = await client.sendAsync({
       from: process.env.mail,
       to: process.env.orders_email,
       subject: 'New order - Cryptogirl Merch store',
       text: message_text
	});
}catch(e){
    console.log(e)
   res.status(400).end(JSON.stringify({ message:"Error" }))
   return;
 }
 
 res.status(200).end(JSON.stringify({ message:'Send Mail' }))
}