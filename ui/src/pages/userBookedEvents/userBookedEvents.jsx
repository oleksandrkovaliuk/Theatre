import React, {
  Fragment,
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

export const UserBookedEvents = () => {
  const { user } = useContext(UserContext);
  const { setNotificationMessage } = useContext(NotificationContext);
  const [listOfBookedEvents, setListOfBookedEvents] = useState(null);
  const [ticketInfo, setTicketInfo] = useState({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const ticket = useRef();

  const openTicket = (item) => {
    console.log(item, "item");
    setTicketInfo(item);
    onOpen();
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
      setNotificationMessage(error);
    }
  };
  const getListOfBookedEventsByUser = useCallback(async () => {
    try {
      const user = await checkLoginned();
      const res = await bookedEventsByUser({ email: user?.email });
      setListOfBookedEvents(res);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage]);
  useEffect(() => {
    getListOfBookedEventsByUser();
  }, [getListOfBookedEventsByUser]);
  return (
    <div className={u.user}>
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
      <Table>
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
              ?.sort((a, b) => new Date(b.beenBooked) - new Date(a.beenBooked))
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

                      {formatTime(item.eventTime) > formatTime(new Date()) && (
                        <Tooltip showArrow content="Cancel your event">
                          <button>cancel</button>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};
