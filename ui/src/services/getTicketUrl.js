import html2canvas from "html2canvas";

export const getTicketUrl = async (currentRef) => {
  const canvas = await html2canvas(currentRef);
  return canvas.toDataURL("image/png");
};
