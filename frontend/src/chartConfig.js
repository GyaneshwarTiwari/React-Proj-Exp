// src/chartConfig.js
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Title,
    Filler,
} from "chart.js";

// Register everything we use in the app (pie, bar, line, etc.)
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Title,
    Filler
);

// optional: global config defaults (tweak as needed)
ChartJS.defaults.font.family = "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
ChartJS.defaults.font.size = 13;
ChartJS.defaults.color = "#374151"; // text gray
