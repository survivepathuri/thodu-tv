// Renders assets/branding/*.svg to PNG. Dev-only helper; nothing from it ships in the app.
// Needs @resvg/resvg-js, which is NOT a project dependency. Install it anywhere and point RESVG_DIR at it:
//   mkdir /some/dir && cd /some/dir && npm i @resvg/resvg-js && RESVG_DIR=/some/dir node tools/make-branding.mjs
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const dir = process.env.RESVG_DIR;
if (!dir) {
  throw new Error('Set RESVG_DIR to a folder where @resvg/resvg-js is installed');
}
const {Resvg} = createRequire(path.join(dir, 'x.js'))('@resvg/resvg-js');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = name => fs.readFileSync(path.join(root, 'assets', 'branding', name), 'utf8');
const png = (svg, width, out, opts = {}) => {
  const r = new Resvg(svg, {fitTo: {mode: 'width', value: width}, font: {loadSystemFonts: true}, ...opts});
  fs.mkdirSync(path.dirname(out), {recursive: true});
  fs.writeFileSync(out, r.render().asPng());
};

const b = name => path.join(root, 'assets', 'branding', name);
png(src('icon.svg'), 1024, b('icon-1024.png'));
png(src('banner.svg'), 1280, b('banner-1280x720.png'));
png(src('splash-mark.svg'), 1152, b('splash-mark-1152.png'));

// Optional: also write launcher/splash resources into a generated android project.
const res = process.env.ANDROID_RES;
if (res) {
  const mip = {mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192};
  const spl = {mdpi: 288, hdpi: 432, xhdpi: 576, xxhdpi: 864, xxxhdpi: 1152};
  const round = src('icon.svg').replace('<rect width="512" height="512" fill="#FFF4DE"/>', '<circle cx="256" cy="256" r="256" fill="#FFF4DE"/>');
  for (const [d, s] of Object.entries(mip)) {
    png(src('icon.svg'), s, path.join(res, `mipmap-${d}`, 'ic_launcher.webp'));
    png(round, s, path.join(res, `mipmap-${d}`, 'ic_launcher_round.webp'));
  }
  for (const [d, s] of Object.entries(spl)) {
    png(src('splash-mark.svg'), s, path.join(res, `drawable-${d}`, 'splashscreen_logo.png'));
    fs.copyFileSync(b('banner-1280x720.png'), path.join(res, `drawable-${d}`, 'tv_banner.png'));
  }
  fs.copyFileSync(b('banner-1280x720.png'), path.join(res, 'drawable', 'tv_banner.png'));
}
