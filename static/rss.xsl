<?xml version="1.0" encoding="UTF-8"?>
<!--
  Styles /rss.xml for humans who open it in a browser.
  Feed readers ignore this entirely.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
	<xsl:output method="html" encoding="utf-8" indent="yes"/>
	<xsl:template match="/">
		<html lang="en">
			<head>
				<meta charset="utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1"/>
				<title><xsl:value-of select="/rss/channel/title"/> — feed</title>
				<style>
					:root {
						--bg: #1c1a17;
						--bg-soft: #25221d;
						--ink: #d8cdb8;
						--ink-muted: #99917f;
						--ink-dim: #6a6353;
						--rule: #2c2922;
						--accent: #b4a16f;
					}
					* { box-sizing: border-box; }
					body {
						margin: 0;
						background: var(--bg);
						color: var(--ink);
						font-family: Georgia, 'Times New Roman', serif;
						line-height: 1.7;
					}
					.wrap { max-width: 42rem; margin: 0 auto; padding: 4rem 1.5rem 6rem; }
					.smallcaps {
						font-family: -apple-system, system-ui, sans-serif;
						text-transform: uppercase;
						letter-spacing: 0.1em;
						font-size: 0.72rem;
						font-weight: 600;
						color: var(--ink-muted);
					}
					h1 { font-style: italic; font-weight: 400; font-size: 2.2rem; margin: 0.5rem 0 0; }
					.about {
						margin-top: 1rem; padding: 1rem 1.25rem;
						background: var(--bg-soft);
						border-left: 2px solid var(--accent);
						font-size: 0.95rem; color: var(--ink-muted);
					}
					.about a { color: var(--accent); }
					.item { padding: 1.75rem 0; border-bottom: 1px solid var(--rule); }
					.item a.title {
						color: var(--ink); text-decoration: none;
						font-style: italic; font-size: 1.4rem; line-height: 1.3;
					}
					.item a.title:hover { color: var(--accent); }
					.item p { margin: 0.5rem 0 0; color: var(--ink-muted); font-size: 1rem; }
					.date { margin-top: 0.5rem; }
					.fleuron { text-align: center; color: var(--ink-dim); font-size: 1.3rem; margin: 2.5rem 0 0; }
				</style>
			</head>
			<body>
				<div class="wrap">
					<div class="smallcaps">rss feed · updates quietly</div>
					<h1><xsl:value-of select="/rss/channel/title"/></h1>
					<div class="about">
						<p style="margin:0">
							This is the feed for <a href="https://khaledwaleed.com/writing">khaledwaleed.com/writing</a>.
							Copy this page's address into your feed reader and new essays will
							find you on their own — no algorithm, no account, no noise.
						</p>
					</div>
					<xsl:for-each select="/rss/channel/item">
						<div class="item">
							<a class="title" href="{link}"><xsl:value-of select="title"/></a>
							<p><xsl:value-of select="description"/></p>
							<div class="date smallcaps"><xsl:value-of select="substring(pubDate, 1, 16)"/></div>
						</div>
					</xsl:for-each>
					<div class="fleuron">❦</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
