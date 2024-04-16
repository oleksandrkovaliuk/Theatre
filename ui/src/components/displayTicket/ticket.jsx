import QRCode from "qrcode.react";
import { formatTime } from "../../services/formatTime";
import b from "./ticket.module.scss";
export const Ticket = ({ json, current, currentEventsInfo, chosenSeats }) => {
  return current && currentEventsInfo && chosenSeats ? (
    <div ref={current} className={b.ticket}>
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
          {(json ? JSON.parse(chosenSeats) : chosenSeats)?.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className={b.rightSection}>
        <QRCode
          value={(json ? JSON.parse(chosenSeats) : chosenSeats)?.map((item) =>
            toString(item)
          )}
        />
      </div>
    </div>
  ) : null;
};
