/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Article = require('../api/article/article.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Article.find({}).remove(function() {
  Article.create({
    title : 'Ravens owner on Ray Rice: ‘We did not do all we should have done’',
    url : 'http://www.msnbc.com/msnbc/baltimore-ravens-owner-ray-rice-we-did-not-do-all-we-should-have-done',
    topic: 'rayrice',
    body: 'In a letter to stakeholders released Tuesday night, Baltimore Ravens owner Stephen J. Biscotti conceded that the team “did not do all we should have done” in its internal investigation of the Ray Rice domestic violence incident. POLITICSNATION WITH AL SHARPTON, 9/9/14, 6:44 PM ET TMZ: NFL didn’t seek Rice video Biscotti’s letter comes amid widespread criticism of both the Ravens and the NFL for failing to enact a more severe punishment on Rice earlier for a February 15th altercation between the star running back and his now-wife Janay Parker at an Atlantic City casino. Surveillance video showing Rice dragging a seemingly unconscious Parker from an elevator became public shortly thereafter and the NFL was slammed repeatedly for levying just a two-game suspension of Rice.'
  }, {
    title : 'President Obama to make case for ISIS intervention',
    url : 'http://www.msnbc.com/morning-joe/president-obama-make-case-isis-intervention',
    topic: 'ISIS',
    body: 'On the eve of the anniversary of the September 11th attacks, the president will speak directly to the American people, outlining his strategy to tackle the Islamic State of Iraq and Syria in a rare primetime address. That “comprehensive strategy to degrade and ultimately destroy ISIL” will include “military action and support for the forces combating ISIL on the ground, both the opposition in Syria and a new, inclusive Iraqi government,” a White House official said in a statement early Wednesday, referring to ISIS by an alternate acronym. ALL IN WITH CHRIS HAYES, 9/9/14, 8:00 PM ET Obama says he\'ll go it alone against ISIS Obama made clear in a meeting with congressional leaders on Tuesday that he plans to move forward with the intervention with or without their support.'
  }, {
    title : 'Obama backs more aid to Syrian rebels, laying possible groundwork for airstrikes',
    url : 'http://www.foxnews.com/politics/2014/09/10/obama-reportedly-willing-to-authorize-airstrikes-against-isis-in-syria/',
    topic: 'ISIS',
    body: 'President Obama is asking Congress for approval to further arm and support moderate Syrian rebels, as a potential prelude to ordering airstrikes inside the country against Islamic State militants. The president is expected to make the call for arming moderate Syrian opposition forces in his prime-time address to the nation Wednesday night. A White House aide told Fox News the president has already asked congressional leaders, with whom he met late Tuesday, to quickly pass a bill giving him the power to ramp up support to Syrian rebels. The aide said the president is seeking more aid for the rebels so they could be the ground troops in place to support potential U.S. airstrikes. The Obama administration already is pursuing a similar strategy in Iraq, where U.S. airstrikes are backed by Iraqi security forces on the ground -- as opposed to U.S. ground troops. '
  }, {
    title : 'Jim Gray calls handling of Ray Rice scandal a "massive failure of judgment"',
    url : 'http://www.foxnews.com/sports/2014/09/10/jim-gray-blasts-massive-failure-judgment-on-ray-rice/',
    topic: 'rayrice',
    body: 'Sportscaster and Fox News contributor Jim Gray blasted the NFL, Baltimore Ravens organization and the local prosecutor Tuesday for the mishandling of the Ray Rice domestic violence scandal."This is a massive failure of judgment by so many people on so many levels," Gray said on "America\'s Newsroom" after the release of new surveillance video in the case. "Where are all these people who led this to this point? It\'s just a massive failure. It\'s totally inexplicable."'
  });
});