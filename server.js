const express = require('express')
const server = express()
const fs = require('fs')
const vuerender = require('vue-server-renderer')
const { createBundleRenderer } = require('vue-server-renderer')
const renderTemp = vuerender.createRenderer()
const serverBundle = require('./vue-ssr-server-bundle.json')
const clientManifest = require('./vue-ssr-client-manifest.json')
const template = `
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
            <title></title>
        </head>
        <body><!--vue-ssr-outlet--></body>
    </html>
`
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
})

server.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
            console.error(err.stack)
        }
    }
    const context = {
        title: '服务端渲染',
        url: req.url
    }
    renderer.renderToString(context, (err, html) => {
        if (err) return handleError(err)
        res.send(html)
    })
})

server.listen(1234)