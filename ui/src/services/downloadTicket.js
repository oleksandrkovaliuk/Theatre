import { getTicketUrl } from "./getTicketUrl";

export const downloadTicket = async ({ json , ticket, chosenSeats }) => {
  const currentTicket = ticket.current;
  if (currentTicket) {
    const href = await getTicketUrl(currentTicket);
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = `YourTicket${json ? JSON.parse(chosenSeats) : chosenSeats.map(
      (item) => item
    )}`;
    fakeLink.href = href;
    console.log(fakeLink);
    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    fakeLink.remove();
  }
};
