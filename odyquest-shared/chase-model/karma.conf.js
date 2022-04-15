module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            "src/**/*.ts" // *.tsx for React Jsx
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript" // *.tsx for React Jsx
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                module: "commonjs"
            },
            tsconfig: "./tsconfig.json",
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"]
    });
};
