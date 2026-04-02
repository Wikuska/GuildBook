module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        deep: "#0e0c0a",
        mid: "#100e0b",
        surface: "#1a1408",
        gold: "#c9a84c",
        sage: "#6b5e42",
        parchment: "#d4c4a0",
        border: "#2a2520",
        "border-accent": "#3d3428",
        "text-dim": "#544a33",
        "text-mid": "#8a7a58",
      },
      borderRadius: {
        1: "4px",
      },
    },
  },
  plugins: [],
};
