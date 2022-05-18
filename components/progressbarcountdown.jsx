import styles from '../styles/Home.module.css'
import Countdown from 'react-countdown';

export default function ProgressBarCountdown(props){
    var next_payday = global.next_payday; //make this dynamic

    const Completionist = () => <span>Withdraw points now!</span>;

    // Renderer callback with condition 1652302800000 
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
        // Render a completed state
        return <Completionist />;
    } else {
        var total_seconds = (days * 24 * 3600) + (hours * 3600) + minutes * 60+seconds;
        const hours_left = total_seconds / 60;
        var percetange = 100 - parseInt(days * 3);
        // Render a countdown 
        return (
            <>
                <style jsx>{`
                    .progress {
                        width: ${percetange}%;
                    }
                    
                `}</style>
                <div suppressHydrationWarning={true} className={styles.progress_bar_parent}><div className='progress'></div></div>
                <span className={styles.progress_span}  suppressHydrationWarning={true}>{days}d {hours}h {minutes}m {seconds}s</span>
            </>
        );
    }
    };

    if(typeof window === 'undefined') {
        // This code will only execute on the server 
        // and not in the browser
      }
  return (
    <div className={styles.progress_bar} suppressHydrationWarning={true}>
        <Countdown
            date={next_payday}
            renderer={renderer}
        />
            
    </div>
  )
}