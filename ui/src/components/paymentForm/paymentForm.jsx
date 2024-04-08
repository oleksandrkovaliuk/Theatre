import React, { useContext, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import "./stripeCustomStyle.scss";
import p from "./paymentForm.module.scss";
import { NotificationContext } from "../../context/notificationContext";

export const PaymentForm = ({ goToRecieve, updateAllBookedSeats }) => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcesing, setIsProcesing] = useState(false);
  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    try {
      if (stripe && elements) {
        setIsProcesing(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}`,
          },
          redirect: "if_required",
        });
        if (!error && paymentIntent && paymentIntent.status === "succeeded") {
          setNotificationMessage("your payment succesfully completed");
          setIsProcesing(false);
          updateAllBookedSeats();
          goToRecieve();
        } else {
          console.log("error");
          setNotificationMessage(`Payment status: ${paymentIntent.status}`);
          setIsProcesing(false);
        }
      }
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  return (
    <form className={p.payment_form}>
      <PaymentElement />
      <button
        disabled={isProcesing}
        onClick={handleSubmitPayment}
        className={p.submitPayment}
      >
        {isProcesing ? "Procesing ..." : "Submit payment"}
      </button>
      <p>
        After complete payment you will be redirected to recieve page where you
        can save or send your ticket on your email.
        <b> Please do not lose your ticket</b>
      </p>
    </form>
  );
};
