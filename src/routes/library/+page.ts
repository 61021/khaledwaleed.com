// Hidden for now (see the `hidden` map in hooks.server.ts). Prerendered
// pages are served from the static pipeline and never reach the worker,
// so the room must opt out of prerendering for the 302 to fire (and the
// unlinked route would otherwise fail the build's prerender crawl check).
export const prerender = false
