const themes = {
	dark: {
		"--navcol": "#243447",
		"--uicol": " #1b2836",
		"--bgcol": "#141d26",
		"--focuscol": "#34a1f2",
		"--seccol": "rgba(255, 255, 255, .5)",
		"--maincol": "rgba(255, 255, 255, .95)",
		"--midcol": "rgba(255, 255, 255, .7)",
		"--switchoffbg": "#939393",
		"--switchoffbtn": "#fafafa",
		"--switchonbg": "#5bcafb",
		"--switchonbtn": "#009ef6",
		"--vertificationcol": "white",
		"--dropshcol": "rgba(0, 0, 0, .75)",
		"--messagebg": "#4B7197",
		"--messagefieldbg": "linear-gradient(-180deg, #233447, #213145, #233447)",
		"--messagefieldbor": "black",
		"--addnavshadow": "0px 0px 5px 0px black;"
	},

	light: {
		"--navcol": "#ffffff",
	  "--uicol": " #ffffff",
	  "--bgcol": "#e5ecf0",
	  "--focuscol": "#34a1f2",
	  "--seccol": "rgba(0, 0, 0, .5)",
	  "--maincol": "rgba(0, 0, 0, .95)",
	  "--midcol": "rgba(0, 0, 0, .7)",
	  "--switchoffbg": "#939393",
	  "--switchoffbtn": "#fafafa",
	  "--switchonbg": "#5bcafb",
	  "--switchonbtn": "#009ef6",
	  "--vertificationcol": "var(--focuscol)",
	  "--dropshcol": "rgba(255, 255, 255, .75)",
	  "--messagebg": "#e5ecf0",
	  "--messagefieldbg": "#ffffff",
	  "--messagefieldbor": "rgba(0, 0, 0, .05)",
	  "--addnavshadow": "0px 0px 5px 0px rgba(0, 0, 0, .35)"
	}
}

function get(theme) {
	return themes[theme];
}

export default get;