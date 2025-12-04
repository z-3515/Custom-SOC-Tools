import fs from "fs";
import esbuild from "esbuild";

const META_FILE = "./dist/maxx.user.js";
const ENTRY_FILE = "./src/main.js";

// 1) Đọc metadata
let meta = fs.readFileSync(META_FILE, "utf8");

// 2) Regex lấy version dạng MAJOR.MINOR (VD: 1.0, 2.5, 3.12)
const versionRegex = /@version\s+(\d+)\.(\d+)/;
const match = meta.match(versionRegex);

if (!match) {
    console.error("❌ Không tìm thấy @version trong metadata!");
    process.exit(1);
}

let major = Number(match[1]);
let minor = Number(match[2]);

// 3) Tăng version phụ (minor)
minor += 1;

// 4) Tạo version mới (major giữ nguyên)
const newVersion = `${major}.${minor}`;

// 5) Replace vào metadata
meta = meta.replace(versionRegex, `@version      ${newVersion}`);

console.log(`🔼 Version tăng: ${match[1]}.${match[2]} → ${newVersion}`);

// 6) Build esbuild
esbuild.build({
    entryPoints: [ENTRY_FILE],
    bundle: true,
    minify: false,
    write: false,
    format: "iife"
}).then(result => {

    const finalOutput =
`${meta}

${result.outputFiles[0].text}
`;

    fs.writeFileSync(META_FILE, finalOutput);

    console.log("🎉 Build hoàn tất → dist/maxx.user.js");
});
