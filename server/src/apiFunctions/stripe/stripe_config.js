const stripeConfig = (req, res) => {
  try {
    return res
      .status(200)
      .json({ stripePublishKey: process.env.STRIPE_PUBLISHKEY });
  } catch (error) {
    return res.status(401).json({ errorText: "failed getting stripe config" });
  }
};
module.exports = stripeConfig;
