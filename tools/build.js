import fs from "fs";
import esbuild from "esbuild";

// Load metadata
const meta = fs.readFileSync("./dist/maxx.user.js", "utf8").split("==/UserScript==")[0] + "==/UserScript==\n";

// Build + bundle ES6 modules → 1 file duy nhất
esbuild.build({
    entryPoints: ["src/main.js"],
    bundle: true,
    minify: false,
    write: false,
    format: "iife",   // Quan trọng: bọc code trong IIFE để Tampermonkey chạy
}).then(result => {
    const finalOutput = meta + "\n" + result.outputFiles[0].text;
    fs.writeFileSync("./dist/maxx.user.js", finalOutput);
    console.log("🎉 Build thành công → dist/maxx.user.js");
});
