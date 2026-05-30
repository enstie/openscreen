const PRESET_FONT_IMPORTS: Record<string, string> = {
	"Bebas Neue": "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
	Caveat: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap",
	"DM Sans":
		"https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	"Fira Code": "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
	"IBM Plex Mono":
		"https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	"IBM Plex Sans":
		"https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	Inter:
		"https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	Lora: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	Manrope: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap",
	Merriweather:
		"https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	Oswald: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap",
	"Permanent Marker": "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap",
	"Playfair Display":
		"https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	"Plus Jakarta Sans":
		"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap",
	"Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap",
	Sora: "https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap",
};

const loadedPresetFonts = new Set<string>();

function getPrimaryFontFamily(fontFamily: string): string {
	return fontFamily.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

export function loadPresetFont(fontFamily: string): Promise<void> {
	if (typeof document === "undefined") {
		return Promise.resolve();
	}

	const primaryFamily = getPrimaryFontFamily(fontFamily);
	const importUrl = PRESET_FONT_IMPORTS[primaryFamily];
	if (!importUrl || loadedPresetFonts.has(primaryFamily)) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		const styleId = `preset-font-${primaryFamily.toLowerCase().replace(/\s+/g, "-")}`;
		const existingStyle = document.getElementById(styleId);

		if (!existingStyle) {
			const style = document.createElement("style");
			style.id = styleId;
			style.textContent = `@import url('${importUrl}');`;
			document.head.appendChild(style);
		}

		Promise.race([
			document.fonts.load(`16px "${primaryFamily}"`),
			new Promise((_, timeoutReject) =>
				setTimeout(() => timeoutReject(new Error("Preset font load timeout")), 5000),
			),
		])
			.then(() => {
				loadedPresetFonts.add(primaryFamily);
				resolve();
			})
			.catch(reject);
	});
}
