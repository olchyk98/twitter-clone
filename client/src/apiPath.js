const paths = {
	home: {
		apiPath: "http://192.168.10.244:4000",
		wssPath: "ws://192.168.10.244:4000"
	},
	outside: {
		apiPath: "http://localhost:4000",
		wssPath: "ws://localhost:4000"
	}
}

const path = "outside";

const apiPath = paths[path].apiPath;
const wssPath = paths[path].wssPath;

export { apiPath, wssPath };
