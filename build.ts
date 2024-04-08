await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./build",
    target: "bun",
    format: "esm",
    sourcemap: "inline",
    // minify: true,
});

console.log("Build success!");

export {};
