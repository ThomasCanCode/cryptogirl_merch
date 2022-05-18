import '../styles/globals.css'
import Head from 'next/head'
const date = new Date();

global.next_payday = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();


var alreadyRanBoolean;
setInterval(() => {


  let day = date.getDate();
  
  if(day === 1 && alreadyRanBoolean != true){
    
    global.next_payday = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
    alreadyRanBoolean = true;
  }
  if(day === 2){
    alreadyRanBoolean = false;
  }

}, 3600*1);// make sure you don't run this multiple times on the 1st of the month!!!!! make a boolean like alreadyRanBoolean = true, set it false on the next day

function MyApp({ Component, pageProps }) {
  
  return (
  <>
    <Head>
      <title>Cryptogirl Merch</title>
      <meta name="description" content="Therapets" />
      <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png"/>
      <link rel="manifest" href="/static/favicon/site.webmanifest"/>
      <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
      <meta name="msapplication-TileColor" content="#da532c"></meta>
      <meta name="theme-color" content="#ffffff"></meta>
    </Head>
    <Component {...pageProps} />
  </>)
}

export default MyApp