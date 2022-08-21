const elems = [...document.getElementsByClassName("content-header")],
	headers = elems.map((elem) => {
		const holder = elem.innerHTML.replace(/[\n\t]/g, "");
		return holder.includes("<a")
			? holder.substring(0, holder.indexOf("<a")).trim()
			: holder;
	});

const makeId = (str) => {
	const split = str.split(" "),
		final =
			split.filter((s, i) => i !== 0).join("-") +
			"-" +
			split[0].replace(/\./g, "-");
	return final.substring(0, final.length - 1).toLowerCase();
};

function addIDs() {
	elems.forEach((elem) => (elem.id = makeId(elem.innerHTML)));
}

function buildRecursive(justNums, index, result, prefix) {
	let key = prefix + justNums[index] + ".";
	key = headers.filter((header) => header.indexOf(key + " ") === 0)[0];
	!result[key] && (result[key] = {});
	index !== justNums.length - 1 &&
		buildRecursive(
			justNums,
			index + 1,
			result[key],
			key.substring(0, key.indexOf(" "))
		);
}

function processHeaders(headers) {
	const sorted = headers
		.map((header) => header.match(/([0-9]\.)*/)[0])
		.sort((a, b) => b.length - a.length);
	let result = {};
	sorted.forEach((i) => {
		const justNums = i.split(".").filter((char) => char !== "");
		buildRecursive(justNums, 0, result, "");
	});
	return result;
}

const processed = processHeaders(headers);

console.log(processed);

function makeTOC(obj) {
	return Object.keys(obj)
		.sort()
		.map(
			(key) =>
				`<navPoint class="chapter" id="${makeId(
					key
				)}" playOrder="${++count}">
                    <navLabel>
                        <text>${key}</text>
                    </navLabel>
                    <content src="mahasatipatthana.html#${makeId(key)}" />			
                    ${makeTOC(obj[key])}
                </navPoint>`
		)
		.join("");
}

function makeMahaList(obj) {
	return `<ul>${Object.keys(obj)
		.sort()
		.map(
			(key) =>
				`<li>
                    <a href="mahasatipatthana.html#${makeId(key)}">
                        ${key}
                    </a>
                    ${makeMahaList(obj[key])}
                </li>`
		)
		.join("")}</ul>`;
}

const logMahaList = () => console.log(makeMahaList(processed));

const notes = {
	"10 Fetters": 1,
	"3 Fetters": 2,
	"4 Kinds of Mindfulness Meditation": 3,
	"4 Right Efforts": 4,
	"4 Bases of Psychic Power": 5,
	"5 Faculties/Powers": "6-and-7",
	"7 Awakening Factors": 8,
	"8-fold Path": 9,
	"3 Poisons": 10,
	"5 Hindrances": 11,
	"5 Aggregates": 12,
	"6 Sense Fields": 13,
	"4 Noble Truths": 14,
};

function getNum(str) {
	let num = str.split(" ")[0];
	isNaN(+num) && (num = num.split("-")[0]);
	return [+num, str.substring(str.indexOf(num) + num.length).trim()];
}

const sortKeys = (a, b) => {
	const numA = getNum(a),
		numB = getNum(b);
	return numA[0] === numB[0]
		? numA[1].localeCompare(numB[1])
		: numA[0] - numB[0];
};

function logNotes() {
	console.log(
		`<ul>${Object.keys(notes)
			.sort(sortKeys)
			.map((key) => `<li><a href="#notes-${notes[key]}">${key}</a></li>`)
			.join("")}</ul>`
	);
}

function makeNotesTOC() {
	return `<navPoint class="chapter" id="footnotes" playOrder="${++count}">
        <navLabel>
            <text>Notes</text>
        </navLabel>
        <content src="notes.html" />
        ${Object.keys(notes)
			.sort(sortKeys)
			.map(
				(key) =>
					`<navPoint class="chapter" id="num_${++count}" playOrder="${count}">
                        <navLabel>
                            <text>${key}</text>
                        </navLabel>
                        <content src="notes.html#notes-${notes[key]}" />
                    </navPoint>`
			)
			.join("")}
    </navPoint>`;
}

// logNotes();

let count = 0;

function logTOC() {
	console.log(
		`<navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>Title Page</text>
            </navLabel>
            <content src="title.html" />
        </navPoint>
        <navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>Acknowledgments</text>
            </navLabel>
            <content src="thanks.html" />
        </navPoint>
        <navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>Introduction</text>
            </navLabel>
            <content src="intro.html" />
        </navPoint>
        <navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>(MN 118) Ānāpānassati Sutta: Mindfulness of Breathing</text>
            </navLabel>
            <content src="anapanassati.html" />
        </navPoint>
        <navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>(MN 131) Bhaddekaratta Sutta: One Fine Night, a.k.a. Knowing the Better Way to Live Alone</text>
            </navLabel>
            <content src="bhaddekaratta.html" />
        </navPoint>
        <navPoint class="chapter" id="num_${++count}" playOrder="${count}">
            <navLabel>
                <text>(DN 22) Mahāsatipaṭṭhāna Sutta: Longer Discourse on Mindfulness Meditation</text>
            </navLabel>
            <content src="mahasatipatthana.html" />			                
            ${makeTOC(processed)}
        </navPoint>
        ${makeNotesTOC()}`
	);
}

logTOC();
// addIDs();
// logMahaList();
