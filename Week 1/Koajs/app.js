const Koa = require("koa");
const KoaBody = require("koa-body")
const errorHandler = require("./middleware/errorHandler.js");
const routes = require("./routes/routes.js")

const app = new Koa();

 // app.use(async (ctx, next ) => {
 //     ctx.body = "Hello Koa!";
 //     await next();
 // })

app.use(KoaBody());
app.use(errorHandler)
app.use(routes.routes());
app.use(routes.allowedMethods())

app.listen(5000)