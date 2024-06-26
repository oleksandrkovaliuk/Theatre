import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  Fragment,
} from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { formatTime } from "../../services/formatTime";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import b from "./bookEvents.module.scss";
import {
  sendTicket,
  getConfig,
  createPaymentIntent,
  updatedAndSetBookedEvent,
} from "../../services/apiCallConfig";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentForm } from "../../components/paymentForm";
import { NotificationContext } from "../../context/notificationContext";
import { socket } from "../../services/socketSetUp";
import { Ticket } from "../../components/displayTicket";
import { getTicketUrl } from "../../services/getTicketUrl";
import { downloadTicket } from "../../services/downloadTicket";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../store/thunks/events";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
let total = 0;
export const BookEvent = () => {
  const dispatch = useDispatch();
  const { events, user } = useSelector((state) => ({
    events: state.events.list,
    user: state.user.data,
  }));
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
  const [sliderIndex, setSliderIndex] = useState(0);
  const bookEvent = useRef(null);
  const ticket = useRef(null);
  const currentEventsInfo = events?.filter(
    (item) => item.id === Number(searchParams.get("id"))
  );
  const currentEvent = currentEventsInfo?.map((item) =>
    JSON.parse(item.eventseats)
  );
  const settings = {
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipe: false,
    afterChange: (index) => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return setSliderIndex(index);
    },
  };

  // work with chosen seats
  const handleShowingProccesMenu = (event, price) => {
    setChosenSeats((prevState) => {
      const currentElem = event.target.getAttribute("id");
      const arr = [...prevState];
      const checkIfItemIncluded = arr.indexOf(currentElem);
      if (currentElem && checkIfItemIncluded === -1) {
        arr.push(currentElem);
        total += price;
      } else {
        arr.splice(checkIfItemIncluded, 1);
        total -= price;
      }
      setSubtotal(total);
      setProcessMenu(true);

      return arr;
    });
  };
  const updateAllBookedSeats = async ({ status }) => {
    try {
      if (status === "succeeded" && bookEventStep !== "book") {
        setPaymentStatus(status);
        total = 0;
        const updatedSeats = currentEvent.map((item) => {
          item.map((seat) => {
            chosenSeats.map((chosen) => {
              if (seat.id === Number(chosen.replace(/\D/g, ""))) {
                seat.booked = user.email;
              }
            });
          });
          return item;
        });
        updatedAndSetBookedEvent({
          eventId: currentEventsInfo[0].id,
          eventSeats: JSON.stringify(updatedSeats[0]),
          chosenSeats: JSON.stringify(chosenSeats),
          userEmail: user.email,
          daybeenbooked: new Date(),
        }).then(() => {
          bookEvent.current.slickNext();
        });
      }
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  // Navigation between pages
  const handleGoToPaymentSection = async () => {
    try {
      if (user) {
        setBookEventStep("payment");
        bookEvent.current.slickNext();
      } else {
        console.log("hello");
        setNotificationMessage("login first to book event", "warning");
      }
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

  const recieveTicketOnEmail = async () => {
    try {
      await getTicketUrl(ticket.current).then(async (href) => {
        const sent = await sendTicket({
          username: user.username,
          email: user.email,
          ticket: `<img src="${href}"/>`,
        });
        setNotificationMessage(sent.text, "success");
      });
    } catch (error) {
      setNotificationMessage(error);
    }
  };
  // socket logic
  const socketUpdateEvent = useCallback(async () => {
    if (chosenSeats?.length) {
      socket.emit("updatedEvent", [chosenSeats, searchParams.get("id")]);
    }
  }, [chosenSeats, searchParams]);
  const socketGetNewSeats = useCallback(async () => {
    try {
      socket.on("newSeats", async (data) => {
        if (searchParams.get("id") === data[1]) {
          const isEqual =
            JSON.stringify(data[0]) === JSON.stringify(chosenSeats);
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
            console.log("entered");
            bookEvent?.current.slickPrev();
            setChosenSeats([]);
          }
          if (bookEventStep === "book" && sliderIndex === 0) {
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
              dispatch(fetchEvents());
              setGetCurrentEventInfo({
                value: false,
                discription: "",
              });
            }, 2000);
          }
        } else {
          return;
        }
      });
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [
    bookEventStep,
    chosenSeats,
    dispatch,
    paymentStatus,
    searchParams,
    setNotificationMessage,
    sliderIndex,
  ]);
  useEffect(() => {
    if (paymentStatus) {
      socketUpdateEvent();
    }
  }, [bookEventStep, paymentStatus, socketUpdateEvent]);
  useEffect(() => {
    socketGetNewSeats();
  }, [socketGetNewSeats]);
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
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
                  <div className={b.screenFormContainer}>
                    <span>Stage</span>
                  </div>
                  <TransformWrapper disabled={false}>
                    <TransformComponent>
                      <div
                        className={b.seats}
                        style={
                          bookEventStep === "payment"
                            ? {
                                opacity: "0",
                                pointerEvents: "none",
                              }
                            : {
                                opacity: "1",
                                pointerEvents: "unset",
                              }
                        }
                      >
                        {getCurrentEventInfo.value && (
                          <div className={b.newUpdated}>
                            <div className={b.bg}></div>
                            <div className={b.middleNotification}>
                              <span>{getCurrentEventInfo.discription}</span>
                              <div
                                style={{
                                  backgroundImage: "url(/images/802.gif)",
                                }}
                                className={b.payloder}
                              ></div>
                            </div>
                          </div>
                        )}
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
                                  checkIfItemChosen || item.booked.length
                                    ? {
                                        backgroundColor: item.booked.length
                                          ? "var(--color-red)"
                                          : checkIfItemChosen &&
                                            "var(--color-subtitle)",
                                        pointerEvents: item.booked.length
                                          ? "none"
                                          : "unset",
                                      }
                                    : {
                                        backgroundColor:
                                          "var(--color-lightgray)",
                                        pointerEvents: !item.booked.length
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
                                    checkIfItemChosen || item.booked.length
                                      ? {
                                          backgroundColor: item.booked.length
                                            ? "var(--color-red)"
                                            : checkIfItemChosen &&
                                              "var(--color-subtitle)",
                                          pointerEvents: item.booked.length
                                            ? "none"
                                            : "unset",
                                        }
                                      : {
                                          backgroundColor:
                                            "var(--color-lightgray)",
                                          pointerEvents: !item.booked.length
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
                                    checkIfItemChosen || item.booked.length
                                      ? {
                                          backgroundColor: item.booked.length
                                            ? "var(--color-red)"
                                            : checkIfItemChosen &&
                                              "var(--color-subtitle)",
                                          pointerEvents: item.booked.length
                                            ? "none"
                                            : "unset",
                                        }
                                      : {
                                          backgroundColor: item.booked.length
                                            ? "var(--color-red)"
                                            : checkIfItemChosen &&
                                              "var(--color-subtitle)",
                                          pointerEvents: !item.booked.length
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
                    </TransformComponent>
                  </TransformWrapper>

                  <div className={b.seatsInfo}>
                    <div className={b.seatInfoBlock}>
                      <span
                        style={{
                          backgroundColor: "var(--color-lightgray)",
                        }}
                        className={b.seatColor}
                      ></span>
                      <span className={b.info}>Availabel</span>
                    </div>
                    <div className={b.seatInfoBlock}>
                      <span
                        style={{
                          backgroundColor: "var(--color-red)",
                        }}
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
              </Fragment>
            );
          })}
          {stripePublishKey && clientSecret && bookEventStep === "payment" && (
            <>
              <h1>Payment</h1>
              <Elements stripe={stripePublishKey} options={{ clientSecret }}>
                <PaymentForm
                  goToRecieve={({ status }) => updateAllBookedSeats({ status })}
                />
              </Elements>
            </>
          )}
          {paymentStatus && (
            <>
              <h1>Recieve</h1>
              <div className={b.recievePage}>
                <div className={b.ticket_instruction}>
                  <Ticket
                    current={ticket}
                    currentEventsInfo={currentEventsInfo}
                    chosenSeats={chosenSeats}
                  />
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
                    <button
                      onClick={() =>
                        downloadTicket({
                          ticket: ticket,
                          chosenSeats: chosenSeats,
                        })
                      }
                    >
                      Download
                    </button>
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
