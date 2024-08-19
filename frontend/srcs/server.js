const express = require("express");
const path = require("path");

//express 앱 객체 
const app = express();

app.use(express.static(path.resolve(__dirname)));
//get 요청이 어떤 경로로 들어오더라도 index.html를 돌려준다.
app.get("/*",(req, res)=>{
	res.sendFile(path.resolve(__dirname, "index.html"));
});

//포트 지정.
app.listen( 3001, ()=> console.log("Server Running..."));
//process.env : NodeJS 앱이 동작할 리눅스/유닉스 시스템의 환경변수