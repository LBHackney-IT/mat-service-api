import jwt from 'jsonwebtoken';

export default function generateToken(id: string, name: string, email: string, groups: string[], secret: string) {
	let body = {
		sub: id,
		email: email,
		iss: "Hackney",
		name: name,
		groups: groups
	}
	return jwt.sign(body, secret);
}
