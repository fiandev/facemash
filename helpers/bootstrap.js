/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
"use strict";

const fs = require("fs");
const path = require("path");
const globals = require("./globals");
const Images = globals.importModel("Images");
const Categories = globals.importModel("Categories");

let initControllers = (app) => {
  let route = null;

  fs.readdirSync(path.resolve(__dirname, "../controllers")).forEach((file) => {
    if (file.substr(-3) === ".js") {
      route = require("../controllers/" + file);
      route.controller(app);
    }
  });
};

let initModels = () => {
  loadModels();

  return globals.sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Finished database synchronization.");
      
      return installImages();
    })
    .catch((err) => {
      console.error("Error occurred during database synchronization:", err);
    });
};

let loadModels = () => {
  fs.readdirSync(path.resolve(__dirname, "../models")).forEach((file) => {
    if (file.substr(-3) === ".js") {
      require("../models/" + file);
      console.log("Finished loading model:", file);
    }
  });
};

let installImages = async () => {
  let images = [];
  let categories = [];
  
  if (await Images.count() > 0 || await Categories.count() > 0) return;
  
  fs.readdirSync(path.resolve(__dirname, "../public/images")).forEach(
    async (folder, folderIndex) => {
      let slug = folder.replace(" ", "-");
      
      let category = await Categories.create({
        name: folder,
        slug: slug
      });
      
      fs.readdirSync(path.resolve(__dirname, `../public/images/${ folder }`)).forEach( async (filename, index) => {
        
        await Images.create({ 
          filename: filename,
          category_id: category.category_id,
        });
      });
      
    },
  );
};

let registerStaticResources = (app, express) => {
  app.use(express.static(path.join(__dirname, "../public")));
};

let register404 = (app) => {
  app.use((req, res) => {
    res.render("404");
  });
};

module.exports.initApp = (app, express) => {
  return Promise.resolve()
    .then(initControllers.bind(null, app))
    .then(initModels)
    .then(registerStaticResources.bind(null, app, express))
    .then(register404.bind(null, app))
    .then(() => {
      console.log("Successfully completed all bootstrapping jobs.");
    })
    .catch(() => {
      console.error("Oops!!! Error occurred during bootstrapping.");
    });
};
