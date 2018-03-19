
+++
title = "I let people run Unsanitized Input on my Database"
description = "Rust, Postgres unsantitized input"
date = 2018-03-19
+++


I went the full [little bobby tables](https://xkcd.com/327/).

My [SQL window functions tutorial](https://www.windowfunctions.com) got popular and hit the front of [HN](https://news.ycombinator.com/item?id=16333838). Because it is an SQL tutorial I litterally have to let users type in SQL and run it on my server. I stayed up until 3am that night reading comments and imagining myself having a little battle with fellow recurser dan luu who's post was also on HN that night. Overall it proved to be a most interesting experiment.

Some background, I started creating this because I didn't know anything about window functions and to be honest not much about databases either. The whole thing was built in about 6 days and over half of that was spent doing UX testing on people and tweaking the css, js and html. I have the good people at recurse center to thank for the inspiration for many of those incremental improvements. Those answer summaries that pop up when you complete a question [Pedro's](https://github.com/ondoheer) idea. The link in the hints [Alicja's](https://github.com/trueskawka) and many other people who helped with testing. Plus I got to write my [funniest ever commit message](https://github.com/bootandy/window_funcs/commit/867b04588bb1b6605f23ba006087eca407d4b4bc)


I expected to be asked 2 things if I got on HN:

1) Why did you use Rust?
2) You are vulnerable to SQL injection.

Well (1) didn't happen but I sure got a lot of (2). But that's ok, I am a huge believer in shipping early, seeing what works and tweaking it as I go. Plus there was nothing important in that database. Twice my backend crashed but unfortunately I was foolishly logging only SQL that caused errors not all SQL so I couldn't track down the root cause. I suspect it was a non-terminating SQL statement - This was fixed by adding query timeouts.

Overall though I'm impressed with the Rust / Rocket / Tera / Postgres setup. A small Linode server was able to handle a flood of HN traffic.


[window functions](https://www.windowfunctions.com) has been revamped with a few more questions and made mobile friendly. Try it if you haven't.

<hr/>

What follows are Postgres statements applied in an attempt to make my server more resilient to SQL injection:

Starting point: By default our user can edit our table, so lets stop that:
```
GRANT USAGE ON SCHEMA public TO USER;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO USER;
```
Ok now the user can't change the data inside our table. However they can still create tables so they could fill the DB with junk, Lets stop them creating tables:
```
REVOKE ALL ON schema public FROM public;
REVOKE ALL ON schema public FROM USER;
```
Now we are getting somewhere. Our user (and new ones) can no longer create new tables. However they can still access pg_user so lets lock that down:
```
REVOKE ALL ON schema pg_catalog, public, information_schema from public;
```
Further reading about postgres implies that we are not meant to go [this far](https://www.postgresql.org/message-id/14232.1424216140%40sss.pgh.pa.us). Infact I wanted my users to be able to call CAST - whose functionality is now broken by blocking access to pg_catalog, so lets return access to pg_catalog:
```
GRANT USAGE ON SCHEMA pg_catalog to USER;
GRANT SELECT ON pg_catalog.pg_cast TO USER;
```

Side note about Schemas:

Initially the data was in the public schema. That felt dirty so I moved it to its own schema.
```
GRANT USAGE ON SCHEMA windowfunctions TO USER;
GRANT SELECT ON ALL TABLES IN SCHEMA windowfunctions TO USER;
ALTER user USER set search_path TO windowfunctions;
```
This felt cleaner.

I also fixed what was probably the root cause of people taking down my server. I added a statement_timeout to pg_config to block long running queries:
Set statement_timeout in the PG config file /etc/postgresql/id/main/postgresql.conf.

And finally the simplest fix, which I should have done first, as it definitely gives the most resilience for least amount of effort: I tweaked the config for the job to respawn if it crashes.

cat /etc/init/windowfunctions.conf
```
start on runlevel [2345]
stop on runlevel [!2345]

respawn
respawn limit 8 90

script
    chdir $SOME_DIR
    export PATH="/root/.cargo/bin:$PATH"
    export ROCKET_ENV="prod"
    echo "path is: $PATH"
    exec cargo +nightly run --release .
end script
```

