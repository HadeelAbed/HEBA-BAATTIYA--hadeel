const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const B = "D:/موقع سعودي/heba-baattiya/heba-baattiya";
const PUBLIC = path.join(B, "public");

// ---- 1. Collect referenced files from src code ----
const refs = new Set();
function walkSrc(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkSrc(p);
    else {
      const c = fs.readFileSync(p, "utf8");
      const re = /["'`](\/(?!api\/|admin\/|_next|fonts\/|images\/)[^"'`]*\.(?:jpg|jpeg|png|webp|svg|ico))["'`]/gi;
      let m;
      while ((m = re.exec(c)) !== null) refs.add(m[1].replace(/^\//, ""));
    }
  }
}
walkSrc(path.join(B, "src"));

// ---- 2. Collect DB product image URLs (decoded) ----
function requireProject(m) {
  return require(path.join(B, "node_modules", m));
}
(async () => {
  const { PrismaClient } = requireProject("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.productImage.findMany({ select: { url: true } });
    for (const r of rows) {
      const dec = decodeURIComponent(r.url.replace(/^\//, ""));
      refs.add(dec);
    }
  } finally {
    await prisma.$disconnect();
  }

  // ---- 3. Walk public, classify ----
  const all = [];
  function walkPub(d, rel) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      const r = rel ? rel + "/" + e.name : e.name;
      if (e.isDirectory()) walkPub(full, r);
      else all.push({ full, rel: r });
    }
  }
  walkPub(PUBLIC, "");

  const toDelete = [];
  const toCompress = [];
  const deleteSize = { before: 0, after: 0 };
  for (const f of all) {
    const refKey = f.rel.split("/").map((s) => decodeURIComponent(s)).join("/");
    if (!refs.has(refKey)) {
      toDelete.push(f);
      deleteSize.before += fs.statSync(f.full).size;
    } else {
      const sz = fs.statSync(f.full).size;
      if (sz > 300 * 1024) toCompress.push(f);
    }
  }

  console.log("Total files in public:", all.length);
  console.log("Referenced & >300KB to compress:", toCompress.length);

  // ---- 4. Compress ----
  let saved = 0;
  for (const f of toCompress) {
    const ext = path.extname(f.full).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") continue;
    try {
      const before = fs.statSync(f.full).size;
      const meta = await sharp(f.full).metadata();
      const w = meta.width || 1600;
      const resizeW = Math.min(w, 1600);
      let img = sharp(f.full).resize({ width: resizeW, withoutEnlargement: true });
      const out = f.full + ".tmp.jpg";
      await img
        .flatten({ background: "#fff" })
        .jpeg({ quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
        .toFile(out);
      fs.renameSync(out, f.full);
      const after = fs.statSync(f.full).size;
      saved += before - after;
      console.log("  OK", (before / 1024 / 1024).toFixed(1) + "MB ->", (after / 1024 / 1024).toFixed(2) + "MB", " ", f.rel);
    } catch (err) {
      console.log("  FAIL", f.rel, err.message);
    }
  }
  console.log("Compression freed:", (saved / 1024 / 1024).toFixed(1), "MB");

  // ---- 5. Convert referenced PNG -> JPG (DSC_6869 copy.png) ----
  const pngPhoto = toCompress.find((f) => f.rel.toLowerCase().endsWith(".png"));
  if (pngPhoto) {
    const jpgRel = pngPhoto.rel.replace(/\.png$/i, ".jpg");
    const jpgFull = path.join(PUBLIC, jpgRel);
    if (!fs.existsSync(jpgFull)) {
      await sharp(pngPhoto.full)
        .resize({ width: 1600, withoutEnlargement: true })
        .flatten({ background: "#fff" })
        .jpeg({ quality: 82, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
        .toFile(jpgFull);
      console.log("Converted PNG -> JPG:", jpgRel);
    }
  }

  // ---- 6. Delete unreferenced files ----
  console.log("Unreferenced to delete:", toDelete.length, "(" + (deleteSize.before / 1024 / 1024).toFixed(1) + " MB)");
  for (const f of toDelete) {
    fs.unlinkSync(f.full);
    console.log("  DEL", f.rel);
  }
  // remove now-empty dirs
  function rmEmpty(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const p = path.join(d, e.name);
        rmEmpty(p);
        try { fs.rmdirSync(p); } catch {}
      }
    }
  }
  rmEmpty(PUBLIC);
  console.log("DONE");
})();
