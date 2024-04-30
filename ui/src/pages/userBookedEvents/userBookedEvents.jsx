import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import u from "./userBookedEvents.module.scss";
import { sendTicket } from "../../services/apiCallConfig";
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
  ScrollShadow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
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
import { ObservationHandler } from "../../services/observationHandler";
import "./tableCustom.scss";
import { SearchIcon } from "../../icons/search";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelBooked,
  allBookedTicketsByUser,
  deleteExpiredSeats,
} from "../../store/thunks/tickets";
import { TopArrow } from "../../icons/topArrow";
import { useDebounce } from "../../hooks/useDebounce";
import { Bin } from "../../icons/bid";

export const UserBookedEvents = () => {
  const { user, tickets } = useSelector((state) => ({
    user: state.user.data,
    tickets: state.tickets.list,
  }));

  const dispatch = useDispatch();

  const { setNotificationMessage } = useContext(NotificationContext);

  const [ticketInfo, setTicketInfo] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [statusFilter, selectedStatusFilter] = useState(new Set(["all"]));
  const [timeFilter, selectedTimeFilter] = useState(new Set(["All time"]));
  const [searchValue, setSearchValue] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const ticket = useRef();
  const tableElem = useRef();

  const getFilterValue = (filter) => {
    return Array.from(filter).join(", ").replaceAll("_", " ");
  };

  const openTicket = (item) => {
    setTicketInfo(item);
    onOpen();
  };

  const cancelBookedEvent = async (item, toShow) => {
    try {
      const res = await dispatch(
        cancelBooked({
          eventId: item?.eventId,
          seatsId: item?.bookedSeats,
          email: user.email,
          toShow: toShow,
          search: searchValue?.length ? searchValue : null,
          filterByTime: timeFilter ? getFilterValue(timeFilter) : null,
          filterByStatus: statusFilter ? getFilterValue(statusFilter) : null,
        })
      ).unwrap();
      setNotificationMessage(res?.text, "success");
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  };

  const getListOfBookedEventsByUser = useCallback(
    async (amoutToShow) => {
      try {
        if (user?.email) {
          setShowSpinner(true);
          await dispatch(
            allBookedTicketsByUser({
              email: user?.email,
              toShow: amoutToShow,
              search: searchValue?.length ? searchValue : null,
              filterByTime: timeFilter ? getFilterValue(timeFilter) : null,
              filterByStatus: statusFilter
                ? getFilterValue(statusFilter)
                : null,
            })
          ).unwrap();
        }
        setShowSpinner(false);
      } catch (error) {
        setNotificationMessage(error, "danger");
      }
    },
    [
      dispatch,
      searchValue,
      setNotificationMessage,
      statusFilter,
      timeFilter,
      user?.email,
    ]
  );

  const getSearchedItemByValue = () => {
    try {
      dispatch(
        allBookedTicketsByUser({
          email: user?.email,
          toShow: 10,
          search: searchValue?.length ? searchValue : null,
          filterByTime: timeFilter ? getFilterValue(timeFilter) : null,
          filterByStatus: statusFilter ? getFilterValue(statusFilter) : null,
        })
      );
    } catch (error) {
      setNotificationMessage("couldnt search event by this name", "danger");
    }
  };

  const getValueForSearching = useDebounce(getSearchedItemByValue, 300);

  const getResultBySearchValue = (e) => {
    getValueForSearching();
    setSearchValue(e.target.value);
  };
  const sendFilterSettings = useCallback(() => {
    try {
      return dispatch(
        allBookedTicketsByUser({
          email: user?.email,
          toShow: 10,
          search: searchValue?.length ? searchValue : null,
          filterByTime: timeFilter ? getFilterValue(timeFilter) : null,
          filterByStatus: statusFilter ? getFilterValue(statusFilter) : null,
        })
      );
    } catch (error) {
      setNotificationMessage("something wend wrong with seted you filters");
    }
  }, [
    dispatch,
    user?.email,
    searchValue,
    timeFilter,
    statusFilter,
    setNotificationMessage,
  ]);

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

  const handleScrollCall = useCallback(async () => {
    try {
      if (tickets?.length >= 10) {
        await getListOfBookedEventsByUser(tickets?.length + 10);
      }
    } catch (error) {
      setNotificationMessage(error, "danger");
    }
  }, [tickets?.length, getListOfBookedEventsByUser, setNotificationMessage]);
  console.log(Array.from(timeFilter).join(", ").replaceAll("_", " "), "check");
  useEffect(() => {
    getListOfBookedEventsByUser(10);
  }, [getListOfBookedEventsByUser]);
  useEffect(() => {
    if (statusFilter || timeFilter) {
      sendFilterSettings();
    }
  }, [sendFilterSettings, statusFilter, timeFilter]);
  return (
    <>
      <div className={u.navigationIntoPage}>
        <div className={u.searchBar}>
          <input
            type="text"
            id="searchBar"
            name="searchBar"
            placeholder=" "
            onChange={getResultBySearchValue}
            className={u.searchBarInput}
          />
          <label htmlFor="searchBar" className={u.searchBarLabel}>
            <SearchIcon />
            Search by event name....
          </label>
        </div>
        <div className={u.filter}>
          <Dropdown
            showArrow
            // classNames={{
            //   base: "before:bg-default-200", // change arrow background
            //   content: "p-0 border-small border-divider bg-background",
            // }}
          >
            <DropdownTrigger>
              <button>
                <Chip
                  size="sm"
                  color={statusColorMap[getFilterValue(statusFilter)]}
                  variant="flat"
                >
                  {getFilterValue(statusFilter) === "finished"
                    ? "expired"
                    : getFilterValue(statusFilter)}
                </Chip>
                <TopArrow />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={statusFilter}
              onSelectionChange={selectedStatusFilter}
              disallowEmptySelection
              selectionMode="single"
              variant="flat"
            >
              <DropdownItem key="all">
                <Chip
                  color={statusColorMap["default"]}
                  size="sm"
                  variant="flat"
                >
                  all
                </Chip>
              </DropdownItem>
              <DropdownItem key="active">
                <Chip color={statusColorMap["active"]} size="sm" variant="flat">
                  active
                </Chip>
              </DropdownItem>
              <DropdownItem key="finished">
                <Chip
                  color={statusColorMap["finished"]}
                  size="sm"
                  variant="flat"
                >
                  expired
                </Chip>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown showArrow>
            <DropdownTrigger>
              <button>
                {getFilterValue(timeFilter)} <TopArrow />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={timeFilter}
              onSelectionChange={selectedTimeFilter}
              disallowEmptySelection
              selectionMode="single"
              variant="flat"
            >
              <DropdownItem key="All time">All time</DropdownItem>
              <DropdownItem key="Past 24h">Past 24h</DropdownItem>
              <DropdownItem key="Past week">Past week</DropdownItem>
              <DropdownItem key="Past month">Past month</DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          removeWrapper
          className="custom-table"
          bottomContent={<ObservationHandler onObserv={handleScrollCall} />}
        >
          <TableHeader>
            {bookedEventHead.map((headers) => (
              <TableColumn key={headers.id}>{headers.label}</TableColumn>
            ))}
          </TableHeader>
          {!tickets?.length ? (
            <TableBody emptyContent={"No tickets booked yet."}>{[]}</TableBody>
          ) : (
            <TableBody>
              {tickets.map((item) => (
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
                          new Date(item.eventTime) < new Date()
                            ? "finished"
                            : "active"
                        ]
                      }
                      size="sm"
                      variant="flat"
                    >
                      {new Date(item.eventTime) < new Date()
                        ? "expired"
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
                        <button
                          className={u.navIcons}
                          onClick={() => openTicket(item)}
                        >
                          <TicketIcon />
                        </button>
                      </Tooltip>
                      {new Date(item.eventTime) > new Date() ? (
                        <Popover
                          placement="bottom-end"
                          showArrow={true}
                          shouldFlip={true}
                          shouldBlockScroll={true}
                        >
                          <PopoverTrigger>
                            <button>cancel</button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className={u.doubleCheckMenu}>
                              <h1>
                                You sure you wanna <b>cancel</b> this book ?
                              </h1>
                              <button
                                onClick={() => cancelBookedEvent(item, 10)}
                              >
                                Cancel
                              </button>
                              <p>
                                After you canceled <b>Money</b> will be
                                <b> Refunded</b> on your <b>Bank account</b>
                              </p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Popover
                          placement="bottom-end"
                          showArrow={true}
                          shouldFlip={true}
                          shouldBlockScroll={true}
                        >
                          <PopoverTrigger>
                            <button className={u.navIcons}>
                              <Bin />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className={u.doubleCheckMenu}>
                              <h1>
                                Are you sure you wanna delete <b>expired </b>
                                event ?
                              </h1>
                              <button
                                onClick={() =>
                                  dispatch(
                                    deleteExpiredSeats({
                                      seat: item.bookedSeats,
                                      email: user?.email,
                                      toShow: 10,
                                      search: searchValue.length
                                        ? searchValue
                                        : null,
                                      filterByTime: timeFilter
                                        ? getFilterValue(timeFilter)
                                        : null,
                                      filterByStatus: statusFilter
                                        ? getFilterValue(statusFilter)
                                        : null,
                                    })
                                  )
                                }
                              >
                                Delete
                              </button>
                              <p>
                                Deleting <b>expired</b> events , it is more
                                about <b>making</b> your <b>booked</b>history
                                <b>orginized</b>
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
    </>
  );
};
