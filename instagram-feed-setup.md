# Setting up the live Instagram feed

The marketing page can show the @axocolumbia feed in one of two ways. The
first keeps itself up to date; the second is a stand-in until it does.

## 1. The live feed (set up once, then forget it)

An Instagram feed service connects to the account and hands you an address
to point the site at. New posts then appear on the site on their own.

1. Sign up with a feed service. **LightWidget** and **SnapWidget** both
   have free plans and both give you a plain address to paste, which is
   what this site expects. Behold and Elfsight work too.
2. Connect the **@axocolumbia** account. You will need to be logged in to
   that account, and it usually has to be a **Business or Creator**
   account — that switch is free, in the Instagram app under
   *Settings → Account type and tools*.
3. Build the feed in their editor — the grid layout and a row of six or
   nine posts suits this page best.
4. Copy the address they give you. It looks something like:

       https://cdn.lightwidget.com/widgets/xxxxxxxxxxxx.html
       https://snapwidget.com/embed/xxxxxxx

5. Open `marketing.html`, find this line, and paste it between the quotes:

       <div class="feed-widget" data-widget-url=""></div>

That is the whole change. Save, commit, and the feed is live.

If the service gives you a **block of code** instead of a plain address,
paste that block inside the div instead:

       <div class="feed-widget">
           ...their code here...
       </div>

Either form works — the site uses whichever it finds.

### If the feed looks too short or too tall

Open `style.css`, find `--widget-height: 720px` under "THE LIVE FEED", and
change that number. Some services size their own feed and will ignore it.

### Worth knowing

- Free plans usually show a small credit line from the service.
- These services read the account through Instagram's official API, so if
  the chapter ever revokes the connection the feed stops updating.

## 2. The hand-picked posts (the fallback)

Used only while no live feed is set up. In `marketing.html` there is a
list of post links:

    <li><a href="https://www.instagram.com/p/ABC123/">Post 1</a></li>

Paste real post links in — on Instagram, open a post, tap the three dots,
then *Copy link*. Add or delete lines freely; they appear in the order
listed, three across, so three, six, or nine fill the rows neatly.

These are real embeds pulled from Instagram, so each shows its current
caption and likes — but the list only ever holds the posts you chose, so
it does not keep itself current.

With neither set up, the section is just the profile box, which is the
intended state — nothing broken-looking appears.
