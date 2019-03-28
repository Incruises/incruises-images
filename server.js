const sharp = require('sharp');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const request = require('request-promise-native');

// response
router.get('/images', async (ctx, next) => {
    const { url, name, download, size } = ctx.query;

    if (download) {
        ctx.set('Content-Disposition', `attachment; filename="${name}"`);
        ctx.body = ctx.req.pipe(request(url));
        return;
    }

    if (size) {
        let [ width, height ] = size.split('x');
        
        let image = await request({
            url: url,
            encoding: null
        });

        ctx.body = sharp(image).resize(parseInt(width), parseInt(height));

        return;
    }
});
  
app
.use(router.routes())
.use(router.allowedMethods());

app.listen(3000);