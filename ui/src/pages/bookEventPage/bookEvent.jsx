import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  Fragment,
} from "react";
import { EventsContext } from "../../context/eventsContext";
import { NavLink, useSearchParams } from "react-router-dom";
import { formatTime } from "../../services/formatTime";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import b from "./bookEvents.module.scss";
import {
  checkLoginned,
  createPaymentIntent,
  getConfig,
  getEvents,
  sendTicket,
  updateBookedEvents,
} from "../../services/apiCallConfig";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "../../components/paymentForm";
import { NotificationContext } from "../../context/notificationContext";
import QRCode from "qrcode.react";
import { socket } from "../../services/socketSetUp";
import html2canvas from "html2canvas";
import { userContext } from "../../context/userInfoContext";
let total = 0;
export const BookEvent = () => {
  const { events, setCommingEvents } = useContext(EventsContext);
  const { user } = useContext(userContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [searchParams] = useSearchParams();
  const [processMenu, setProcessMenu] = useState(false);
  const [subtotal, setSubtotal] = useState(null);
  const [pricePerSeat, setPricePerSeat] = useState("");
  const [chosenSeats, setChosenSeats] = useState([]);
  const [bookEventStep, setBookEventStep] = useState("book");
  const [stripePublishKey, setStripePublishKey] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [getCurrentEventInfo, setGetCurrentEventInfo] = useState({
    value: false,
    discription: "",
  });
  const [ticketLink, setTicketLink] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);
  const bookEvent = useRef(null);
  const ticket = useRef(null);
  const currentEventsInfo = events?.filter(
    (item) => item.id === Number(searchParams.get("id"))
  );

  const settings = {
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: false,
    afterChange: (index) => setSliderIndex(index),
  };
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
    setProcessMenu(true);
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
              seat.bokker = user.email;
              seat.ticket = ticketLink;
            }
          });
          return seat;
        });
        console.log(item, "items");
        return item;
      });
      console.log(updatedSeats, "seats");
      updateBookedEvents({
        id: currentEventsInfo[0].id,
        eventSeats: JSON.stringify(updatedSeats[0]),
      });
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [
    chosenSeats,
    currentEventsInfo,
    setNotificationMessage,
    ticketLink,
    user,
  ]);
  // Navigation between pages
  const handleGoToPaymentSection = async () => {
    try {
      await checkLoginned();
      setBookEventStep("payment");
      bookEvent.current.slickNext();
    } catch (error) {
      console.log(error);
      setNotificationMessage(error);
    }
  };
  const handleGoToRecieveSection = async () => {
    try {
      setPaymentStatus(true);
      bookEvent.current.slickNext();
      console.log(ticket.current, "current");
    } catch (error) {
      setNotificationMessage(error);
    }
  };
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
  // saving ticket
  const downloadTicket = () => {
    const currentTicket = ticket.current;
    if (currentTicket) {
      const fakeLink = window.document.createElement("a");
      fakeLink.style = "display:none;";
      fakeLink.download = `YourTicket${chosenSeats.map((item) => item)}`;
      fakeLink.href = ticketLink;
      console.log(fakeLink);
      document.body.appendChild(fakeLink);
      fakeLink.click();
      document.body.removeChild(fakeLink);
      fakeLink.remove();
    }
  };

  const recieveTicketOnEmail = async () => {
    try {
      const sent = await sendTicket({
        username: user.username,
        email: user.email,
        ticket: `<img src=${ticketLink} />`,
      });
      setNotificationMessage(sent.text);
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  // socket logic
  const socketUpdateEvent = useCallback(async () => {
    if (chosenSeats?.length) {
      socket.emit("updatedEvent", chosenSeats);
    }
  }, [chosenSeats]);
  const socketGetNewSeats = useCallback(async () => {
    try {
      socket.on("newSeats", (data) => {
        const isEqual = JSON.stringify(data) === JSON.stringify(chosenSeats);
        if (isEqual && !ticket.current) {
          setProcessMenu(false);
          setChosenSeats([]);
        }
        if (
          isEqual &&
          bookEventStep === "payment" &&
          !paymentStatus &&
          !ticket.current
        ) {
          bookEvent.current.slickPrev();
          setChosenSeats([]);
        }
        if (bookEventStep === "book") {
          setGetCurrentEventInfo({
            value: true,
            discription: `${
              isEqual
                ? "Sorry . But somebody booked your"
                : "Updated info about"
            } ${chosenSeats.length > 1 && chosenSeats ? "seats" : "seat"} ${
              isEqual ? chosenSeats?.map((item) => item) : ""
            } . Here is updated seats`,
          });
          setTimeout(async () => {
            const updatedEvents = await getEvents();
            setCommingEvents(updatedEvents);
            setGetCurrentEventInfo({
              value: false,
              discription: "",
            });
          }, 2000);
        }
      });
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [
    bookEventStep,
    chosenSeats,
    paymentStatus,
    setCommingEvents,
    setNotificationMessage,
  ]);
  useEffect(() => {
    if (paymentStatus) {
      socketUpdateEvent();
      if (ticket.current) {
        html2canvas(ticket.current).then((canvas) => {
          return setTicketLink(canvas.toDataURL("image/png"));
        });
      }
    }
  }, [bookEventStep, paymentStatus, socketUpdateEvent]);

  useEffect(() => {
    socketGetNewSeats();
  }, [socketGetNewSeats]);
  useEffect(() => {
    if (ticketLink) {
      updateAllBookedSeats();
    }
  }, [ticketLink, updateAllBookedSeats]);
  // set up stripe
  useEffect(() => {
    if (subtotal) {
      Promise.all([setUpStripeConfig(), setUpClientSecret()])
        .then(() => {
          setPaymentStatus(false);
        })
        .catch((error) => {
          console.log(error, " error");
        });
    }
  }, [setUpClientSecret, setUpStripeConfig, subtotal]);

  return (
    <>
      <div className={b.navigationSteps}>
        <span
          style={
            sliderIndex === 0 && !paymentStatus
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
            sliderIndex === 1 && !paymentStatus
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
            paymentStatus
              ? {
                  color: "var(--color-red)",
                  fontFamily: "var(--font-SfMedium)",
                }
              : { color: "var(--color-title)" }
          }
        >
          Receive your ticket
        </span>
        {!paymentStatus && bookEventStep !== "book" && (
          <button onClick={handleGoBack} className={b.goBack}>
            Back
          </button>
        )}
      </div>
      <div
        style={
          processMenu && chosenSeats.length && sliderIndex === 0
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
        <Slider ref={bookEvent} {...settings}>
          {currentEventsInfo?.map((item) => {
            const parsedSeats = JSON.parse(item.eventseats);
            return (
              <Fragment key={item.id}>
                <h1>Book event</h1>
                <div className={b.bookEventWrap}>
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
                            13115 135 St NW , T5L 1Y6 "Kazan Theater of the
                            Young Spectator"
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
                    {getCurrentEventInfo.value && (
                      <div className={b.newUpdated}>
                        <div className={b.bg}></div>
                        <div className={b.middleNotification}>
                          <span>{getCurrentEventInfo.discription}</span>
                          <div
                            style={{ backgroundImage: "url(/images/802.gif)" }}
                            className={b.payloder}
                          ></div>
                        </div>
                      </div>
                    )}
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
                                        backgroundColor:
                                          "var(--color-lightgray)",
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
              </Fragment>
            );
          })}
          {stripePublishKey && clientSecret && bookEventStep === "payment" && (
            <>
              <h1>Payment</h1>
              <Elements stripe={stripePublishKey} options={{ clientSecret }}>
                <PaymentForm goToRecieve={handleGoToRecieveSection} />
              </Elements>
            </>
          )}
          {paymentStatus && (
            <>
              <h1>Recieve</h1>
              <div className={b.recievePage}>
                <div className={b.ticket_instruction}>
                  <div ref={ticket} className={b.ticket}>
                    <div className={b.left_info}>
                      <div className={b.topSection}>
                        <img src="./images/logo.png" alt="logo" />
                        <span>Best wishes by Theater</span>
                      </div>
                      {currentEventsInfo?.map((item) => (
                        <div key={item.id} className={b.infoAboutTicket}>
                          <div className={b.info}>
                            <span>Event</span>
                            <h2>{item.name}</h2>
                          </div>
                          <div className={b.info}>
                            <span>Starting time</span>
                            <h2>{formatTime(item.startingtime)}</h2>
                          </div>
                        </div>
                      ))}
                      <div className={b.ticketSeats}>
                        <span>Seats:</span>
                        {chosenSeats.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className={b.rightSection}>
                      <QRCode
                        value={chosenSeats.map((item) => toString(item))}
                      />
                    </div>
                  </div>

                  <ul className={b.instruction}>
                    <li className={b.main_text}>Term & Condition</li>
                    <li>- Show the ticket at the entrance</li>
                    <li>- The ticket is valid for 2 movie nights.</li>
                    <li>
                      - Disruptive audience members will be asked to leave
                      immediately.
                    </li>
                    <li>- Event date and time are subject to change.</li>
                    <li>- Remember to turn off your phone during the movie.</li>
                    <li>- Have a great time!</li>
                  </ul>
                </div>
                <div className={b.wayToRecieveTicket}>
                  <span>
                    Chose way how you wanna recieve or save your ticket
                  </span>
                  <div className={b.ways}>
                    <button onClick={downloadTicket}>Download</button>
                    <button onClick={recieveTicketOnEmail}>
                      Recieve on email
                    </button>
                  </div>
                </div>
                <NavLink to={"/"}>Back to home page</NavLink>
              </div>
            </>
          )}
        </Slider>
      </div>
    </>
  );
};
