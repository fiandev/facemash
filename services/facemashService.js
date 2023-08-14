/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";

const globals = require("../helpers/globals");
const images = globals.importModel("Images");
const categories = globals.importModel("Categories");
const battles = globals.importModel("Battles");
const sequelize = require("sequelize");
const arrayWrap = require("arraywrap");

let expectedScore = (Rb, Ra) => {
  return parseFloat((1 / (1 + Math.pow(10, (Rb - Ra) / 400))).toFixed(4));
};

let winnerScore = (score, expected) => {
  return score + 24 * (1 - expected);
};

let loserScore = (score, expected) => {
  return score + 24 * (0 - expected);
};

module.exports = {
  renderIndexPage: async (config) => {
    let _categories = await categories.findAll();
    
    return config.success.call(this, {
      categories: _categories
    })
  },
  
  renderVersusPage: async (config) => {
    let randomImages;
    let categorySlug = config.params.params.categorySlug || "";
    let category = await categories.find({ 
      where: {
        slug: categorySlug
      }
     });
    
    if (!category) {
      return config.error.call(this, {
        message: "category not found !"
      }, "client");
    }
    images
      .findAll({
        limit: 2,
        where: {
          category_id: category.category_id
        },
        order: [sequelize.fn("RAND")],
      })
      .then((images) => {
        randomImages = images;

        return globals.sequelize.query(
          `SELECT * FROM images WHERE category_id=${ category.category_id } ORDER BY ROUND(score/(1+(losses/wins))) DESC LIMIT 0,10`,
        );
      })
      .then((topRatings) => {
        config.success.call(this, {
          images: randomImages,
          category: category,
          expected: expectedScore,
          topRatings: topRatings[0],
        });
      })
      .catch((err) => {
        config.error.call(this, err);
      });
  },

  rateImages: async (config) => {
    let winnerID = arrayWrap(config.params.query.winner || "")[0];
    let loserID = arrayWrap(config.params.query.loser || "")[0];
    
    if (winnerID && loserID) {
      let winner, loser;

      images
        .find({
          where: {
            image_id: winnerID,
          },
        })
        .then((image) => {
          winner = image;

          return images.find({
            where: {
              image_id: loserID,
            },
          });
        })
        .then((image) => {
          loser = image;
          let winnerExpected = expectedScore(loser.score, winner.score);
          let winnerNewScore = winnerScore(winner.score, winnerExpected);

          return images.update(
            {
              score: winnerNewScore,
              wins: winner.wins + 1,
            },
            {
              where: {
                image_id: winnerID,
              },
            },
          );
        })
        .then(() => {
          let loserExpected = expectedScore(winner.score, loser.score);
          let loserNewScore = loserScore(loser.score, loserExpected);

          return images.update(
            {
              score: loserNewScore,
              losses: loser.losses + 1,
            },
            {
              where: {
                image_id: loserID,
              },
            },
          );
        })
        .then(() => {
          return battles.build({ winner: winnerID, loser: loserID }).save();
        })
        .then(() => {
          config.success.call(this);
        })
        .catch((err) => {
          config.error.call(this, err);
        });
    } else {
      config.error.call(this, null, "client");
    }
  },
};
