CREATE TABLE films (
	id TEXT PRIMARY KEY NOT NULL,
	tmdbId INTEGER NOT NULL,
	type TEXT NOT NULL CHECK (type IN ('movie', 'tv')),
	rating INTEGER NOT NULL,
	watched INTEGER NOT NULL DEFAULT 1,
	watchedOn TEXT NOT NULL DEFAULT '',
	notes TEXT NOT NULL DEFAULT '',
	privateNotes TEXT NOT NULL DEFAULT '',
	title TEXT NOT NULL DEFAULT '',
	year INTEGER NOT NULL DEFAULT 0,
	format TEXT NOT NULL DEFAULT '',
	runtime INTEGER NOT NULL DEFAULT 0,
	genres TEXT NOT NULL DEFAULT '[]',
	directors TEXT NOT NULL DEFAULT '[]',
	posterPath TEXT NOT NULL DEFAULT '',
	poster TEXT NOT NULL DEFAULT '',
	created TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	updated TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE UNIQUE INDEX idx_films_tmdbId_type ON films (tmdbId, type);
