export const totalPort = 4

export const locations = ["Waterloo", "Toronto"]

export const routes = ["highway", "urban", "combined"]

export const validation = {
	"name": {
		"limit": 15,
		"rule": /^[a-zA-Z0-9]*$/,
		"text": "Up to 15 Letters and Numbers",
	},
	"email": {
		"rule": /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
		"text": "Must be a valid email",	
	},
	"password": {
		"limit": 20,
		"text": "Up to 20 Any Characters",
	}
}