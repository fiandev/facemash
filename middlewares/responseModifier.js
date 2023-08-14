/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";

module.exports = (req, res, next) => {
  res.renderServerError = () => {
    res.status(500).send("Oops! Internal server Error.");
  };
  res.renderClientError = () => {
    res.render("404");
  };
  next();
};
