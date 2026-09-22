import { createRemoteJWKSet, jwtVerify } from 'jose'

/** The one identity /manage answers to, even if the Access policy ever widens. */
export const OWNER_EMAIL = 'foxilated@gmail.com'

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined
let jwksDomain = ''

/**
 * The email in a Cloudflare Access token, verified against the team's signing
 * keys and this app's AUD; null when the token is missing, forged, expired,
 * or belongs to someone else.
 */
export async function accessOwner(
	token: string | null | undefined,
	teamDomain: string | undefined,
	aud: string | undefined,
): Promise<string | null> {
	if (!token || !teamDomain || !aud)
		return null
	if (!jwks || jwksDomain !== teamDomain) {
		jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`))
		jwksDomain = teamDomain
	}
	try {
		const { payload } = await jwtVerify(token, jwks, { issuer: teamDomain, audience: aud })
		return payload.email === OWNER_EMAIL ? OWNER_EMAIL : null
	}
	catch {
		jwks = undefined
		return null
	}
}
