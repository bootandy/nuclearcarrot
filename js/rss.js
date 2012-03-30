//function load() {
//  var feed ="http://nuclearcarrot.posterous.com/rss.xml";
//  new GFdynamicFeedControl(feed, "feedControl");
//
//}
//google.load("feeds", "1");
//google.setOnLoadCallback(load);


google.load("feeds", "1");

function OnLoad() {
  // Create a feed control
  var feedControl = new google.feeds.FeedControl();

  // Add two feeds.
	feedControl.addFeed("http://nuclearcarrot.posterous.com/rss.xml", "Nuclear Carrot Blog <a href='http://nuclearcarrot.posterous.com/rss.xml'> <img alt='rss' src='images/rss-feed.png' /> </a>");
  // Draw it.
  feedControl.setNumEntries(3);
  feedControl.draw(document.getElementById("feedControl"));
}

google.setOnLoadCallback(OnLoad);