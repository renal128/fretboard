const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_MAP = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11};
const CHORDS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const CHORDS_MAP = { 'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6 };
const INTERVALS = {	MAJOR: [2, 2, 1, 2, 2, 2, 1] };

class Fret {
	constructor(number, offset) {
		this.n = number + offset;
		this.note = NOTES[this.n % 12];
	}

	isInScale(tonic) {
		const keyOffset = NOTES_MAP[tonic];
		const noteNumber = (this.n - keyOffset + 12) % 12;
		let interval = 0;
		for (let i = 0; i < 7; i++) {
			if (interval === noteNumber) {
				return true;
			}
			interval += INTERVALS.MAJOR[i];
		}
		return false;
	}

	isNth(tonic, chord, n) {
		const chordIndex = CHORDS_MAP[chord];
		const tonicIndex = NOTES_MAP[tonic];
		let offset = 0;
		for (let i = 0; i < chordIndex + n - 1; i++) {
			offset += INTERVALS.MAJOR[i % 7];
		}
		return this.n % 12 === (tonicIndex + offset) % 12;
	}
	
	isRoot(tonic, chord) {
		return this.isNth(tonic, chord, 1);
	}

}

class GString {
	constructor(name, offset) {
		const frets = [];
		for (let i = 0; i <= 22; i++) {
			const fret = new Fret(i, offset);
			frets.push(fret);
		}
		this.name = name;
		this.frets = frets;
	}
}

function getDistances(chord) {
	const chordIndex = CHORDS_MAP[chord];
	const distanceToThird = INTERVALS.MAJOR[chordIndex % 7] + INTERVALS.MAJOR[(chordIndex + 1) % 7]; 
	const distanceFromThirdToFifth = INTERVALS.MAJOR[(chordIndex + 2) % 7] + INTERVALS.MAJOR[(chordIndex + 3) % 7];
	return [distanceToThird, distanceFromThirdToFifth];
}

function formatChord(chord) {
	const distances = getDistances(chord);
	if (isMajor(distances)) {
		return chord;
	} else if (isMinor(distances)) {
		return chord.toLowerCase();
	} else if (isDiminished(distances)) {
		return chord.toLowerCase() + '°';
	}
}

function isMinor(distances) {
	return distances[0] === 3 && distances[1] === 4;
}

function isMajor(distances) {
	return distances[0] === 4 && distances[1] === 3;	
}

function isDiminished(distances) {
	return distances[0] === 3 && distances[1] === 3;
}

app = new Vue({
  	el: '#app',
  	data: {
  		NOTES,
  		CHORDS,
    	message: 'Hello Vue.js!',
    	key: 'C',
    	selectedChord: 'I',
    	showSeventh: false,
    	strings: [
	    	new GString('e', 28),
	    	new GString('B', 23),
	    	new GString('G', 19),
	    	new GString('D', 14),
	    	new GString('A', 9),
	    	new GString('E', 4),
	    ]
	},
	methods: {
		formatChord,
	}
})