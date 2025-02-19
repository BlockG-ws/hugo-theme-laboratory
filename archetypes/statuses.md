+++
title = '最新动态'
date = {{ .Date }}
draft = false
# layout configuration
# supported layouts: statuses, statuses-nojs, statuses-static
# statuses: dynamic loading of fediverse statuses using javascript, updates in real-time
# statuses-nojs: static loading of fediverse statuses using hugo template, updates on every time hugo build sites.
# statuses-static: static loading of statuses using hugo data, updates on every time data changed & hugo build sites.
# statuses-static supports loading custom data from data files.
# statuses-static is useful when you want to write your own statuses or use external tools to pull data from external sources.
# it supports multiple files. simply pull all files in the data/statuses directory.
layout = 'statuses'
description = "查看 {{ .Site.Params.author.name }} 的最新动态"
# source configuration
# supported activitypub software: all software that supports mastodon-compatible api
# for example: Mastodon (and forks like glitch-soc), Akkoma, Firefish, Sharkey, etc.
# instance_url = 'https://instance.tld'
# username = 'username'
# fetch options, refer to https://docs.joinmastodon.org/methods/accounts/#statuses for details
# supported options: limit, exclude_reblogs, only_media, exclude_replies, tagged
# exclude_reblogs = true
+++
