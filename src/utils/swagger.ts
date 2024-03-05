import swaggerJSDoc from "swagger-jsdoc";
const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "My brand BE API",
			version: "1.0.0",
			description: "my",
		},
	},
	 apis: ["./dist/**/*.js"],
};
const swaggerDocuments=swaggerJSDoc(options);

export default swaggerDocuments;