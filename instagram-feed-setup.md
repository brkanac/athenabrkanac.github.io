# The Instagram feed

The marketing page shows the **@axocolumbia** feed through
[LightWidget](https://lightwidget.com), which reads the account directly.
New posts appear on the site on their own — there is nothing to edit here
when you post.

## Changing what the feed looks like

Log in to LightWidget and edit the widget there: how many posts it shows,
how many across, the spacing, whether captions appear. Save it, and the
site picks the change up on its own.

Do not edit the feed's appearance in `marketing.html` — the code there is
just the address of your widget, and LightWidget controls the rest.

## The code on the page

In `marketing.html`, inside the Instagram section:

    <div class="feed-widget">
        <script src="https://cdn.lightwidget.com/widgets/lightwidget.js"></script>
        <iframe
            src="https://lightwidget.com/widgets/a4f2fc0998fc5cd7be42ba3c8580fc01.html"
            ...
        ></iframe>
    </div>

The long string in the address is your widget's id. If you ever rebuild
the widget from scratch, LightWidget hands you a new block of code —
paste it over the two lines inside that div.

The script is LightWidget's, and its job is to measure the feed and set
the iframe's height. That is why no height is set in `style.css`, only a
starting `min-height` so the page does not jump while it loads.

## If the feed stops showing

- Check the widget is still live in your LightWidget account. These
  services connect through Instagram's official API, and that connection
  can expire or be revoked — reconnecting the account in LightWidget
  usually fixes it.
- Free plans normally show a small LightWidget credit line, and can cap
  how often the feed refreshes.
- A browser extension that blocks third-party content will hide the feed
  for that visitor. The **@axocolumbia** box above it is a plain link, so
  there is always a way through to Instagram either way.
