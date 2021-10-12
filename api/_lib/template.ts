import { readFileSync } from 'fs'
import marked from 'marked'
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'
const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64')
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64')
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64')

function getCss(theme: string, fontSize: string) {
  //   let background = 'white'
  let foreground = 'black'
  //   let radial = 'lightgray'

  if (theme === 'dark') {
    // background = 'black'
    foreground = 'white'
    // radial = 'dimgray'
  }
  return `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300&display=swap');

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
        }

    body {
        background-color: rgba(165, 197, 214, 0.1);
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 0px 30px 50px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'Noto Sans JP', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.5;
    }
    
    .owl {
        position: absolute;
        top: 0;
        right: 0;
    }
    
    .blog-name {
        font-family: 'Roboto', sans-serif;
        position: absolute;
        bottom: 0;
        font-size: 50px;
        color: #082e50;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    `
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <img class="owl" alt="owl" src="https://og-image-blue.vercel.app/owl-blue.png" width="900px" height="auto" />
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                  .map((img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i]))
                  .join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(md ? marked(text) : sanitizeHtml(text))}
            </div>
        </div>
        <p class="blog-name">blog.owlcode.net</p>
    </body>
</html>`
}

function getImage(src: string, width = 'auto', height = '350') {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
  return i === 0 ? '' : '<div class="plus">+</div>'
}
