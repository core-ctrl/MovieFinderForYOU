// utils/history.js
export function saveHistory(item) {
    try {
        const raw = localStorage.getItem("watch_history") || "[]";
        const arr = JSON.parse(raw);
        const existing = arr.find(a => a.id === item.id);
        if (!existing) arr.unshift(item);
        localStorage.setItem("watch_history", JSON.stringify(arr.slice(0, 100)));
    } catch { }
}

export function getHistory() {
    try {
        return JSON.parse(localStorage.getItem("watch_history") || "[]");
    } catch { return []; }
}

