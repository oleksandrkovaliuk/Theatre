import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import u from "./userBookedEvents.module.scss";
import {
  bookedEventsByUser,
  checkLoginned,
  sendTicket,
  cancelBookedSeat,
  getEvents,
} from "../../services/apiCallConfig";
import { NotificationContext } from "../../context/notificationContext";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Chip,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@nextui-org/react";
import {
  bookedEventHead,
  statusColorMap,
} from "../../utilitis/bookedEventsTable";
import { formatTime } from "../../services/formatTime";
import { TicketIcon } from "../../icons/ticket";
import { Ticket } from "../../components/displayTicket";
import { downloadTicket } from "../../services/downloadTicket";
import { getTicketUrl } from "../../services/getTicketUrl";
import { UserContext } from "../../context/userInfoContext";
import { EventsContext } from "../../context/eventsContext";
import { ObservationHandler } from "../../services/observationHandler";
import { TopArrow } from "../../icons/topArrow";
import "./tableCustom.scss";
import { SearchIcon } from "../../icons/search";
export const UserBookedEvents = () => {
  const { user } = useContext(UserContext);
  const { setCommingEvents } = useContext(EventsContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [listOfBookedEvents, setListOfBookedEvents] = useState(null);
  const [ticketInfo, setTicketInfo] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ticket = useRef();
  const tableElem = useRef();
  const openTicket = (item) => {
    setTicketInfo(item);
    onOpen();
  };
  const cancelBookedEvent = async (item) => {
    try {
      const res = await cancelBookedSeat({
        eventId: item?.eventId,
        seatsId: item?.bookedSeats,
      });
      const newEvents = await bookedEventsByUser({ email: user?.email });
      setCommingEvents(await getEvents());
      setNotificationMessage(res.text, "success");
      setListOfBookedEvents(newEvents);
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  };
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
      setNotificationMessage(error, "danger");
    }
  };
  const getListOfBookedEventsByUser = useCallback(
    async (amoutToShow) => {
      try {
        setShowSpinner(true);
        const user = await checkLoginned();
        const res = await bookedEventsByUser({
          email: user?.email,
          amountOfItems: amoutToShow,
        });
        setListOfBookedEvents((prev) => {
          if (prev?.length !== res?.length) {
            return res;
          }
          return prev;
        });
        setShowSpinner(false);
      } catch (error) {
        setNotificationMessage(error, "danger");
      }
    },
    [setNotificationMessage]
  );
  const handleScrollCall = useCallback(async () => {
    try {
      if (listOfBookedEvents?.length >= 10) {
        await getListOfBookedEventsByUser(listOfBookedEvents?.length + 10);
      }
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  }, [
    getListOfBookedEventsByUser,
    listOfBookedEvents?.length,
    setNotificationMessage,
  ]);
  useEffect(() => {
    getListOfBookedEventsByUser(10);
  }, [getListOfBookedEventsByUser]);
  return (
    <>
      <div className={u.navigationIntoPage}>
        <div className={u.searchBar}>
          <input
            type="text"
            id="searchBar"
            name="searchBar"
            className={u.searchBar}
          />
          <label htmlFor="searchBar" className={u.searchbarLabel}>
            <SearchIcon />
            Search by event name....
          </label>
        </div>
        <div className={u.filterNrest}>
          <button key="time">by time</button>
          <button key="time">by status</button>
        </div>
      </div>
      <div className={u.user}>
        {showSpinner && (
          <div className={u.spinner}>
            <Spinner color="default" />
          </div>
        )}
        <Modal
          size={"3xl"}
          backdrop={"blur"}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            <ModalHeader>
              <span className={u.modal_header}>Manage your ticket</span>
            </ModalHeader>
            <ModalBody>
              <Ticket
                json={true}
                current={ticket}
                chosenSeats={ticketInfo?.bookedSeats}
                currentEventsInfo={[
                  {
                    name: ticketInfo?.eventName,
                    startingtime: ticketInfo?.eventTime,
                  },
                ]}
              />
            </ModalBody>
            <ModalFooter>
              <div className={u.manageYourTicketFooter}>
                <button
                  onClick={() =>
                    downloadTicket({
                      json: true,
                      ticket: ticket,
                      chosenSeats: ticketInfo?.bookedSeats,
                    })
                  }
                >
                  Download
                </button>
                <button onClick={recieveTicketOnEmail}>Recieve on email</button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Table
          ref={tableElem}
          isHeaderSticky
          bottomContent={<ObservationHandler onObserv={handleScrollCall} />}
          className="custom-table"
        >
          <TableHeader>
            {bookedEventHead.map((headers) => (
              <TableColumn key={headers.id}>{headers.label}</TableColumn>
            ))}
          </TableHeader>
          {!listOfBookedEvents?.length ? (
            <TableBody emptyContent={"No tickets booked yet."}>{[]}</TableBody>
          ) : (
            <TableBody>
              {listOfBookedEvents
                ?.sort(
                  (a, b) => new Date(b.beenBooked) - new Date(a.beenBooked)
                )
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Popover placement="top-start" showArrow={true}>
                        <PopoverTrigger>
                          <div className={u.eventInfo}>
                            <div className={u.eventImg}>
                              <img src={item.eventUrl} alt="eventImg" />
                            </div>
                            <div className={u.eventDisc}>
                              <span>{item.eventName}</span>
                              <button>{item.eventAge}</button>
                              <span>
                                Booked at <b>{formatTime(item.beenBooked)}</b>
                              </span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className={u.popInfo}>
                            <div className="text-small font-SF-Display-Medium">
                              About event:
                            </div>
                            <div className="text-tiny">{item.eventDisc}</div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          statusColorMap[
                            formatTime(item.eventTime) < formatTime(new Date())
                              ? "finished"
                              : "active"
                          ]
                        }
                        size="sm"
                        variant="flat"
                      >
                        {formatTime(item.eventTime) < formatTime(new Date())
                          ? "finished"
                          : "active"}
                      </Chip>
                    </TableCell>
                    <TableCell>{formatTime(item.eventTime)}</TableCell>
                    <TableCell>
                      {JSON.parse(item.bookedSeats).map((seat, i) => (
                        <span key={seat} className={u.eventSeats}>
                          {seat}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell style={{ textAlign: "right" }}>
                      <div className={u.managingTicket}>
                        <Tooltip showArrow content="Open your tickets">
                          <button onClick={() => openTicket(item)}>
                            <TicketIcon />
                          </button>
                        </Tooltip>

                        {formatTime(item.eventTime) >
                          formatTime(new Date()) && (
                          <Popover placement="bottom-end" showArrow={true}>
                            <PopoverTrigger>
                              <button>cancel</button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className={u.doubleCheckMenu}>
                                <h1>
                                  You sure you wanna <b>cancel</b> this book ?
                                </h1>
                                <button onClick={() => cancelBookedEvent(item)}>
                                  Cancel
                                </button>
                                <p>
                                  After you canceled <b>Money</b> will be
                                  <b> Refunded</b> on your <b>Bank account</b>
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          )}
        </Table>
      </div>
      <div style={{ height: "1000px" }} />
    </>
  );
};
