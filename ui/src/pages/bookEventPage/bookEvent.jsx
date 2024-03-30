import React, { useEffect, useRef, useState, useCallback } from "react";
import { useContext } from "react";
import { EventsContext } from "../../context/eventsContext";
import { useSearchParams } from "react-router-dom";
import { formatTime } from "../../services/formatTime";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import b from "./bookEvents.module.scss";
import {
  createPaymentIntent,
  getConfig,
  updateBookedEvents,
} from "../../services/apiCallConfig";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "../../components/paymentForm";
import { NotificationContext } from "../../context/notificationContext";
import { userContext } from "../../context/userInfoContext";
let total = 0;
const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};
export const BookEvent = () => {
  const { events } = useContext(EventsContext);
  const { userInfo } = useContext(userContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [searchParams] = useSearchParams();
  const [processMenu, showProcessMenu] = useState(false);
  const [subtotal, setSubtotal] = useState(null);
  const [pricePerSeat, setPricePerSeat] = useState("");
  const [chosenSeats, setChosenSeats] = useState([]);
  const [bookEventStep, setBookEventStep] = useState("book");
  const [stripePublishKey, setStripePublishKey] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const bookEvent = useRef(null);
  const currentEventsInfo = events?.filter(
    (item) => item.id === Number(searchParams.get("id"))
  );
  // work with chosen seats
  const handleShowingProccesMenu = (event, price) => {
    const currentElem = event.target.getAttribute("id");
    const arr = [...chosenSeats];
    const checkIfItemIncluded = arr.indexOf(currentElem);
    if (currentElem && checkIfItemIncluded === -1) {
      arr.push(currentElem);
      total += price;
    } else {
      total -= price;
      arr.splice(checkIfItemIncluded, 1);
    }
    setSubtotal(total);
    showProcessMenu(true);
    return setChosenSeats(arr);
  };
  const updateAllBookedSeats = useCallback(async () => {
    try {
      const currentEvent = currentEventsInfo?.map((item) =>
        JSON.parse(item.eventseats)
      );
      const updatedSeats = currentEvent.map((item) => {
        item.map((seat) => {
          chosenSeats.map((chosen) => {
            if (seat.id === Number(chosen.replace(/\D/g, ""))) {
              seat.booked = true;
            }
          });
          return seat;
        });
        return item;
      });
      await updateBookedEvents({
        id: currentEventsInfo[0].id,
        eventSeats: JSON.stringify(updatedSeats[0]),
      });
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [chosenSeats, currentEventsInfo, setNotificationMessage]);

  // Navigation between pages
  const handleGoToPaymentSection = () => {
    setBookEventStep("payment");
    bookEvent.current.slickNext();
  };

  function handleGoToRecieveSection() {
    setBookEventStep("recieve");
    setPaymentStatus(true);
    bookEvent.current.slickNext();
  }

  const handleGoBack = () => {
    if (bookEventStep === "payment") {
      setBookEventStep("book");
    }
    bookEvent.current.slickPrev();
  };

  // Set up payment config
  const setUpStripeConfig = useCallback(async () => {
    try {
      const key = await getConfig();
      return setStripePublishKey(loadStripe(key.stripePublishKey));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setUpClientSecret = useCallback(async () => {
    try {
      const secretKey = await createPaymentIntent({ amount: subtotal });
      return setClientSecret(secretKey.clientSecret);
    } catch (error) {
      console.error(error);
    }
  }, [subtotal]);

  useEffect(() => {
    if (subtotal) {
      Promise.all([setUpStripeConfig(), setUpClientSecret()]).then(() => {
        setPaymentStatus(false);
      });
    }
  }, [setUpClientSecret, setUpStripeConfig, subtotal]);
  useEffect(() => {
    if (paymentStatus) {
      updateAllBookedSeats();
    }
  }, [paymentStatus, updateAllBookedSeats]);
  return (
    <>
      <div className={b.navigationSteps}>
        <span
          style={
            bookEventStep === "book"
              ? {
                  color: "var(--color-red)",
                  fontFamily: "var(--font-SfMedium)",
                }
              : { color: "var(--color-title)" }
          }
        >
          Book events/
        </span>
        <span
          style={
            bookEventStep === "payment"
              ? {
                  color: "var(--color-red)",
                  fontFamily: "var(--font-SfMedium)",
                }
              : { color: "var(--color-title)" }
          }
        >
          Payment/
        </span>
        <span
          style={
            bookEventStep === "recieve"
              ? {
                  color: "var(--color-red)",
                  fontFamily: "var(--font-SfMedium)",
                }
              : { color: "var(--color-title)" }
          }
        >
          Receive your ticket
        </span>
        {bookEventStep !== "recieve" && bookEventStep !== "book" && (
          <button onClick={handleGoBack} className={b.goBack}>
            Back
          </button>
        )}
      </div>
      <div
        style={
          processMenu && chosenSeats.length && bookEventStep === "book"
            ? { bottom: "0px" }
            : { bottom: "-100px" }
        }
        className={b.proccesMenu}
      >
        <div className={b.chosenItemsWrap}>
          <span>Chosen seats: </span>
          {chosenSeats.map((item) => (
            <span key={item} className={b.chosenSeats}>
              {item}
            </span>
          ))}
        </div>
        <div className={b.subtotalAndProccesButton}>
          <div className={b.subtotal}>
            <span>Subtotal:</span>
            <span>{subtotal}$</span>
          </div>
          <button
            onClick={handleGoToPaymentSection}
            className={b.proccesButton}
          >
            Procces
          </button>
        </div>
      </div>
      <div className={b.bookEvent_container}>
        <h1>
          {bookEventStep === "book"
            ? "Book your event"
            : bookEventStep === "payment"
            ? "Payment"
            : "Recieve your Ticket"}
        </h1>
        <Slider ref={bookEvent} {...settings}>
          {currentEventsInfo?.map((item) => {
            const parsedSeats = JSON.parse(item.eventseats);
            return (
              <div key={item.id} className={b.bookEventWrap}>
                <div className={b.infoAboutEventContainer}>
                  <div className={b.infoAboutEvent}>
                    <img src={item.imgurl} alt="event img" />
                    <ul className={b.eventDiscription}>
                      <li className={b.name}>{item.name}</li>
                      <li className={b.age}>{item.age}</li>
                      <li className={b.date_location}>
                        <span>Date</span>
                        <h2>{formatTime(item.startingtime)}</h2>
                      </li>
                      <li className={b.date_location}>
                        <span>Location</span>
                        <h2>
                          13115 135 St NW , T5L 1Y6 "Kazan Theater of the Young
                          Spectator"
                        </h2>
                      </li>
                    </ul>
                  </div>
                  <div className={b.discription}>
                    <span>Discriptions about event</span>
                    <p>{item.disc}</p>
                  </div>
                </div>
                <div className={b.seats_block}>
                  <div className={b.screenFormContainer}>
                    <span>Stage</span>
                  </div>
                  <div className={b.seats}>
                    <div className={b.seatRow}>
                      {parsedSeats.slice(0, 6).map((item) => {
                        const itemId = item.id + item.letter;
                        const checkIfItemChosen = chosenSeats.find(
                          (item) => item === itemId
                        );
                        return (
                          <button
                            key={item.id}
                            id={itemId}
                            style={
                              checkIfItemChosen || item.booked
                                ? {
                                    backgroundColor: item.booked
                                      ? "var(--color-red)"
                                      : checkIfItemChosen &&
                                        "var(--color-subtitle)",
                                    pointerEvents: item.booked
                                      ? "none"
                                      : "unset",
                                  }
                                : {
                                    backgroundColor: "var(--color-lightgray)",
                                    pointerEvents: !item.booked
                                      ? "unset"
                                      : "none",
                                  }
                            }
                            className={b.seat}
                            onClick={(event) =>
                              handleShowingProccesMenu(event, item.price)
                            }
                            onMouseOver={
                              item.price !== pricePerSeat
                                ? () => setPricePerSeat(item.price)
                                : null
                            }
                          >
                            <span>
                              {item.id}
                              {item.letter}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className={b.seatRow}>
                      {parsedSeats
                        .slice(6, parsedSeats.length - 4)
                        .map((item) => {
                          const itemId = item.id + item.letter;
                          const checkIfItemChosen = chosenSeats.find(
                            (item) => item === itemId
                          );
                          return (
                            <button
                              key={item.id}
                              id={itemId}
                              style={
                                checkIfItemChosen || item.booked
                                  ? {
                                      backgroundColor: item.booked
                                        ? "var(--color-red)"
                                        : checkIfItemChosen &&
                                          "var(--color-subtitle)",
                                      pointerEvents: item.booked
                                        ? "none"
                                        : "unset",
                                    }
                                  : {
                                      backgroundColor: "var(--color-lightgray)",
                                      pointerEvents: !item.booked
                                        ? "unset"
                                        : "none",
                                    }
                              }
                              className={b.seat}
                              onClick={(event) =>
                                handleShowingProccesMenu(event, item.price)
                              }
                              onMouseOver={
                                item.price !== pricePerSeat
                                  ? () => setPricePerSeat(item.price)
                                  : null
                              }
                            >
                              <span>
                                {item.id}
                                {item.letter}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                    <div className={b.seatRow}>
                      {parsedSeats
                        .slice(parsedSeats.length - 4, parsedSeats.length)
                        .map((item) => {
                          const itemId = item.id + item.letter;
                          const checkIfItemChosen = chosenSeats.find(
                            (item) => item === itemId
                          );
                          return (
                            <button
                              key={item.id}
                              id={itemId}
                              style={
                                checkIfItemChosen || item.booked
                                  ? {
                                      backgroundColor: item.booked
                                        ? "var(--color-red)"
                                        : checkIfItemChosen &&
                                          "var(--color-subtitle)",
                                      pointerEvents: item.booked
                                        ? "none"
                                        : "unset",
                                    }
                                  : {
                                      backgroundColor: item.booked
                                        ? "var(--color-red)"
                                        : checkIfItemChosen &&
                                          "var(--color-subtitle)",
                                      pointerEvents: !item.booked
                                        ? "unset"
                                        : "none",
                                    }
                              }
                              className={b.seat}
                              onClick={(event) =>
                                handleShowingProccesMenu(event, item.price)
                              }
                              onMouseOver={
                                item.price !== pricePerSeat
                                  ? () => setPricePerSeat(item.price)
                                  : null
                              }
                            >
                              <span>
                                {item.id}
                                {item.letter}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                  <div className={b.seatsInfo}>
                    <div className={b.seatInfoBlock}>
                      <span
                        style={{ backgroundColor: "var(--color-lightgray)" }}
                        className={b.seatColor}
                      ></span>
                      <span className={b.info}>Availabel</span>
                    </div>
                    <div className={b.seatInfoBlock}>
                      <span
                        style={{ backgroundColor: "var(--color-red)" }}
                        className={b.seatColor}
                      ></span>
                      <span
                        style={{ color: "var(--color-red)" }}
                        className={b.info}
                      >
                        Booked
                      </span>
                    </div>
                    <div className={b.seatInfoBlock}>
                      <span>
                        Price per seat -
                        <b style={{ color: "var(--color-red)" }}>
                          {pricePerSeat}$
                        </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {stripePublishKey && clientSecret && bookEventStep === "payment" && (
            <Elements stripe={stripePublishKey} options={{ clientSecret }}>
              <PaymentForm goToRecieve={handleGoToRecieveSection} />
            </Elements>
          )}
          {bookEventStep === "recieve" && paymentStatus && (
            <div className={b.recieve}>"here is your recieve"</div>
          )}
        </Slider>
      </div>
    </>
  );
};
