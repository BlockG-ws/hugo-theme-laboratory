# Laboratory
Simply a theme.
## Features
- No framework, and no external dependencies.
- No JavaScript by default*. (features like dynamic loading of fediverse statuses and comments needs javascript, but all are optional)
- Completely use vanilla CSS and JS.
- simple, clean, and minimalistic design.
- responsive design, looks good on all devices.
- full text RSS feed
- bring your fediverse account home, display your latest statuses on your website.
## Installation
The only method recommend by now is to use the theme as a submodule.
```bash
git submodule add https://github.com/BlockG-ws/hugo-theme-laboratory.git themes/laboratory
```
and to update it:
```bash
git submodule update --remote
```
## Configuration
Copy `hugo.toml` in the project root directory to your hugo site root directory, and modify it to fit your needs.

You can also split it into multiple files, like `config.toml`, `params.toml`, etc., and add them to the `config` directory.

For Reference:
```toml
baseURL = 'https://example.org/'
languageCode = 'en-US'
# TODO: i18n
title = 'My New Hugo Site'
copyright = '' # set it according to your needs

[markup]
  [markup.goldmark]
    [markup.goldmark.parser]
      wrapStandAloneImageWithinParagraph = false
    [markup.goldmark.renderer]
      # set it to true if you want to allow raw HTML in markdown, useful if you want to use static statuses template directly from api.
      # use it at your own risk.
      unsafe = true
  [markup.highlight]
    noClasses = false # to make syntax highlighting really works.

[params]
headerStyle = 'terminal' # choose between "terminal" and "386" (default is 386), or you can create one, simply put it into "assets/css/header/".
siteCoverImage = '' # path to the image you want to use as the site cover image
# the 'type' of the posts displayed in the homepage (default is posts).
# To make it simple, you should put all of your writings into 'contents/[defaultPostsType]/'.
# see https://gohugo.io/methods/page/type/#article for details.
defaultPostsType = 'posts'
[params.article]
# set it to true if you want to show comments in your posts
# To set it up correctly, you need to put some configurations in 'config.toml' and 'layouts/partials/comments.html'.
showComments = false
[params.author]
    name = "Wheatley" # from https://theportalwiki.com/wiki/Wheatley :P, change it to suit your needs.
    email = "hello@example.com" # maybe you need it.


[[menus.main]]
  name = 'Posts'
  pageRef = '/posts'
  weight = 20

[[menus.main]]
  name = 'Tags'
  pageRef = '/tags'
  weight = 30

[module]
  [module.hugoVersion]
    extended = true
    min = "0.116.0"

```
### Configuring statuses
> Bring your Fediverse account home!

To display your latest statuses, you need to create a new file in the `content` directory, and set the layout to `statuses` or `statuses-nojs`.

`instance_url` and `username` are required in the front matter to fetch the statuses from the fediverse. You can also set some fetch options, refer to [Mastodon API documentation](https://docs.joinmastodon.org/methods/accounts/#statuses) for details.

To make it easier, you can use the `archetypes/statuses.md` file to create a new file:
```bash
hugo new content -k statuses content/statuses.md
```
and modify the front matter of new file to fit your needs.

You can also use static statuses, by setting the layout to `statuses-static`, and put your statuses data in the `data/statuses` directory.

The structure of the statuses file should be looked like this:
```yaml
randomid:
  content: 'Hello, World!'
  created_at: '2025-02-19T18:36:00.000Z'
  visibility: unlisted # note: this is not a real visibility, it's just a placeholder by now.
  sensitive: false
  spoiler_text: '' # make sure sensitive is true to use this option. It will render as a warning in the front-end.
  media_attachments_url: 
    - https://example.org/media/1.jpg
  # set it to the url of the media attachments, if any. only absolute url is supported by now.
  url: 'https://example.org/statuses/randomid'
    # set it to the source url of the status, if any. only absolute url is supported by now.
anotherid:
    content: 'Hello, World!'
    # ... the same as above
```
It's also useful if you want to write your own statuses or use external tools to pull data from external sources.

### Configuring blog rolls
To display your friends' links from your website, you need to create a new file in the `content` directory, and set the layout to `friend-links`.

To make it easier, you can use the `archetypes/friends.md` file to create a new file:
```bash
hugo new content -k friends content/friends.md
```
Then write a list of your friends' links in the `data/links.yaml` file with the format:
```yaml
- name: Link # the name/title of the destination
  link: https://www.youtube.com/watch?v=cqT0OKlEo9w # the link to the destination
  avatar: https://example.org/avatar.png # set an avatar
  description: We know each other for so long # the description
- name: Another Link
  link: https://google.com
  avatar: https://example.com/avatar.webp
  description: Your heart's been aching, but you're too shy to say it
  banner: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic2.srcdn.com%2Fwordpress%2Fwp-content%2Fuploads%2F2021%2F02%2FRick-Astley-Never-Gonna-Give-You-Up-Remastered-Header.jpg&f=1&nofb=1&ipt=08ad9de5ea48e701fceb84cac7ddfd241a48e37de6e6fa5f234a6cf68b3635e9&ipo=images # (optional) a banner that will display at the head of card
```

And you're all done! You can now build your site and see your friends' links on your website at /friends/ .

## Special thanks
These projects have inspired me on design/styles of the theme:
- [bearblog](https://bearblog.dev/) for its great terminal theme
- [Freemind.386](https://github.com/blackshow/hexo-theme-freemind.386) for its header style
- [hugo-bearcub](https://github.com/clente/hugo-bearcub) for article list design and custom colors
- [Astro Micro](https://github.com/trevortylerlee/astro-micro) for its recent article list design
- [Primer](https://github.com/pages-themes/primer) for the general styling
- [mdui](https://mdui.org) for article layout and styling

These projects have inspired me on features of the theme:
- [blowfish](https://blowfish.page/) for the TOC displaying and comments features.
- [hugo-bearcub](https://github.com/clente/hugo-bearcub) for the social cards feature.

These projects are directly used in the theme:
- [Sarasa Gothic](https://github.com/be5invis/Sarasa-Gothic) for the font used in the social cards, under [the SIL Open Font License 1.1](https://github.com/be5invis/Sarasa-Gothic?tab=License-1-ov-file#readme).

## License
MIT