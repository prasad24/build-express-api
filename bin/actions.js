// Implementations of actions
const fs      = require('fs');
const config  = require('./config');

var actions = {};

/**
 * Initializes the current directory with all the files needed.
 */
actions.init = () => {
  var initSuccessful = true;
  if(!fs.existsSync('./rest')) {
    // Create folder structure
    fs.mkdirSync('./rest');
    fs.mkdirSync('./rest/models');
    fs.mkdirSync('./rest/controllers');
    // Create package.json
    if(!fs.existsSync('package.json')) {
      var packageJsonText = fs.readFileSync('../templates/packageTemplate.json');

      fs.writeFileSync('package.json',packageJsonText);
    }

    // Create server.js
    var serverText = fs.readFileSync('../templates/serverTemplate.js');

    fs.writeFileSync('./rest/server.js',serverText);

    
  }
  else initSuccessful = false;

  if(initSuccessful) {
    // Print succesfull
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ Initialization successful');
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white,'Please do not change the name of the directories and files created by this cli, as this cli needs those directory names to know where to create models, controllers and more.');
  }
  else {
    console.log(config.terminal_colors.red,"✖ Directory 'rest' already exists."); 
    console.log(config.terminal_colors.white);
  }
}

/**
 * Creates a new plain api controller in rest/controllers with get and post
 * @param {*String} controllerName 
 */
actions.createPlainController = (controllerName) => {

  // If /rest/controllers doesn't exist return
  if(!fs.existsSync('./rest/controllers')) {
    console.log(config.terminal_colors.red,"✖ Missing directory rest/controllers, please run build-express-api init, before adding a controller");
    console.log(config.terminal_colors.white);
    return;
  }

  var success = true;
  var fullControllerName;
  // get fullControllerName to contain Controller
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName.toLowerCase()+'Controller';
  } else fullControllerName = controllerName;

  // Only create controller if it doesn't exist already
  if(!fs.existsSync('./rest/controllers/'+fullControllerName+'.js')) {
    var plainControllerText = fs.readFileSync('../templates/plainControllerTemplate.js');
    
    // get plain controller name eg foodController -> food
    var routeName = fullControllerName.replace('Controller','');

    plainControllerText = plainControllerText.toString().replace(new RegExp('{{controllerName}}','g'), routeName);

    // Create controller
    fs.writeFileSync('./rest/controllers/'+fullControllerName+'.js',plainControllerText);
  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check rest/controllers/'+fullControllerName);
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
  }

}

/**
 * 
 * @param {*String} controllerName 
 * @param {*Object} routes 
 */
actions.createControllerWithCustomRoutes = (controllerName, routes) => {
  if(!fs.existsSync('./rest/controllers')) {
    console.log(config.terminal_colors.red,"✖ Missing directory rest/controllers, please run build-express-api init, before adding a controller");
    console.log(config.terminal_colors.white);
    return;
  }

  var success = true;
  var fullControllerName;
  // get fullControllerName to contain Controller
  if(!controllerName.includes('Controller')) {
    fullControllerName = controllerName.toLowerCase()+'Controller';
  } else fullControllerName = controllerName;

  // Only create controller if it doesn't exist already
  if(!fs.existsSync('./rest/controllers/'+fullControllerName+'.js')) {

      var basicControllerName = fullControllerName.replace('Controller','');
      var routesString = '';
    
      // Go through all of the routes and create them
      for(var prop in routes) {
        var lowercaseProp = prop.toLowerCase();
        var lowercaseMethod = routes[prop].toLowerCase();

        routesString += `// ${lowercaseMethod} /api/${basicControllerName}/${lowercaseProp}
router.${lowercaseMethod}('/${lowercaseProp}',(req,res) => {
  
});

`;
      }

      // Push the routes in the rest
      var routesControllerText = `// ${basicControllerName} controller routes
var express = require('express');
var router = express.Router();

${routesString}
module.exports = router;
`;

      console.log(routesControllerText);

      fs.writeFileSync('./rest/controllers/'+fullControllerName+'.js',routesControllerText);
  }
  else success = false;

  if(success) {
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.green,'✔ '+fullControllerName+' created successfully, check rest/controllers/'+fullControllerName);
    console.log(config.terminal_colors.green,'----------------------------');
    console.log(config.terminal_colors.white);
  }
  else {
    console.log(config.terminal_colors.red,"✖ Controller with that name already exists.");
    console.log(config.terminal_colors.white);
  }

}

module.exports = actions;