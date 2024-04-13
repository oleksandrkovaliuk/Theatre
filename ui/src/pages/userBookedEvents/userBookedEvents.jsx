import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import u from "./userBookedEvents.module.scss";
import { checkLoginned, getEvents } from "../../services/apiCallConfig";
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
  Accordion,
  AccordionItem,
} from "@nextui-org/react";
import {
  bookedEventHead,
  statusColorMap,
} from "../../utilitis/bookedEventsTable";
import { formatTime } from "../../services/formatTime";
import { Ticket } from "../../icons/ticket";
export const UserBookedEvents = () => {
  const { setNotificationMessage } = useContext(NotificationContext);
  const [listOfBookedEvents, setListOfBookedEvents] = useState(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const createListOfBookedEvent = (user, events) => {
    const resultArr = events.reduce((acc, event) => {
      const bookedSeats = JSON.parse(event.eventseats).filter(
        (item) =>
          item.bokker === user.email && item.booked && item.ticket.length > 0
      );
      if (bookedSeats.length > 0) {
        acc.push({
          eventId: event.id,
          eventName: event.name,
          eventDisc: event.disc,
          eventAge: event.age,
          eventTime: event.startingtime,
          eventStatus:
            formatTime(event.startingtime) < formatTime(new Date())
              ? "finished"
              : "active",
          eventImg: event.imgurl,
          bookedSeats: bookedSeats.map((seat) => {
            return {
              seats: seat.id + seat.letter,
              tickets: seat.ticket,
            };
          }),
        });
      }
      return acc;
    }, []);
    return setListOfBookedEvents(resultArr);
  };
  const getListOfBookedEventsByUser = useCallback(async () => {
    try {
      const [user, events] = await Promise.all([checkLoginned(), getEvents()]);
      createListOfBookedEvent(user, events);
    } catch (error) {
      setNotificationMessage(error);
    }
  }, [setNotificationMessage]);
  useEffect(() => {
    getListOfBookedEventsByUser();
  }, [getListOfBookedEventsByUser]);
  return (
    <div className={u.user}>
      <Modal isOpen={isOpen} backdrop={"blur"} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Your tickets for
          </ModalHeader>
          <ModalBody>
            <Accordion variant="splitted">
              {listOfBookedEvents?.map((item) => {
                return item.bookedSeats.map((seat) => (
                  <AccordionItem key={seat.seats} title={seat.seats}>
                    <img src={seat.tickets} alt="ticket" />
                  </AccordionItem>
                ));
              })}
            </Accordion>
          </ModalBody>
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
            {listOfBookedEvents?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Popover placement="top-start" showArrow={true}>
                    <PopoverTrigger>
                      <div className={u.eventInfo}>
                        <div className={u.eventImg}>
                          <img src={item.eventImg} alt="eventImg" />
                        </div>
                        <div className={u.eventDisc}>
                          <span>{item.eventName}</span>
                          <span>{item.eventAge}</span>
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
                    color={statusColorMap[item.eventStatus]}
                    size="sm"
                    variant="flat"
                  >
                    {item.eventStatus}
                  </Chip>
                </TableCell>
                <TableCell>{formatTime(item.eventTime)}</TableCell>
                <TableCell>
                  {item.bookedSeats.map((seat, i) => (
                    <span key={seat.seats} className={u.eventSeats}>
                      {seat.seats}
                    </span>
                  ))}
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <div className={u.managingTicket}>
                    <Tooltip showArrow content="Open your tickets">
                      <button onClick={onOpen}>
                        <Ticket />
                      </button>
                    </Tooltip>
                    <Tooltip showArrow content="Cancel your event">
                      <button>cancel</button>
                    </Tooltip>
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
