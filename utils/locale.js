// utils/locale.js
export async function detectLocation() {
    try {
        const res = await fetch("https://ipapi.co/json").then(r => r.json());
        return {
            country: res.country || res.country_code,
            city: res.city,
            region: res.region,
            ip: res.ip,
        };
    } catch { return { country: "IN" }; }
}

export function primaryLanguagesForCountry(countryCode = "IN") {
    switch ((countryCode || "").toUpperCase()) {
        case "US": return ["English", "Spanish", "French"];
        case "JP": return ["Japanese", "English"];
        case "KR": return ["Korean", "English"];
        case "FR": return ["French", "English", "German"];
        case "DE": return ["German", "English", "French"];
        case "IN":
        default: return ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam"];
    }
}
