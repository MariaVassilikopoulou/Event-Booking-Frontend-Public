import Link from "next/link"
import styles from "../../styles/BookingSuccessPage.module.scss"
export default function BookingSuccessPage(){
    return(
        <div className={styles.pageBackground}>
        <div className={styles.wrapper}>
          <h1>Booking Request Received!</h1>
          <h2>Thank you for booking with Flowvent.</h2>
          <p>An email request for your booking has been sent.</p>
          <p className={styles.warning}>
            Your seats are reserved but will only be secured after completing the payment.
          </p>
          <Link href="/" className={styles.backLink}>Back to Events</Link>
        </div>
      </div>
      
      
    );
  }