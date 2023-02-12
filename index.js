/**
 * @author: Alexander Wunschik <dev@wunschik.net>
 * @license: GPL-3.0-or-later
 */

const LCD = require('raspberrypi-liquid-crystal');
const sleep = require('sleep');

/**
 * @typedef {Object} LCDOptions
 */
const DEFAULT_OPTIONS = {
	bus: 1,
	address: 0x27,
	width: 20,
	height: 4,
};

/**
 * @class JoyItLCD
 */
class JoyItLCD {
	/**
	 * @type {LCDOptions}
	 */
	options = {};

	/**
	 * @type {LCD}
	 */
	lcd;

	constructor(options = {}) {
		this.options = {
			...DEFAULT_OPTIONS,
			...options,
		};

		this.lcd = new LCD(
			this.options.bus,
			this.options.address,
			this.options.width,
			this.options.height
		);

		/*
		 * The joy-it LCD modules use a different pin mapping than the default one.
		 */
		this.lcd.displayPorts = {
			D4: 0x01, // not used
			D5: 0x02, // not used
			D6: 0x04, // not used
			D7: 0x08, // not used

			RS: 0x10,
			RW: 0x20, // not used
			backlight: 0x40, // not available on the RB-20x4-LCD
			E: 0x80,

			CHR: 0x10,
			CMD: 0x00,
		};

		/*
		 * Because the joy-it LCD modules use a different pin mapping than the default one,
		 * we have to overwrite the default _write4Sync and _write4Async functions to
		 * use the lower nibble instead of the upper 4 bits the default functions use.
		 */
		this.lcd._write4Sync = function (x, c) {
			const a = (x >> 4) & 0x0f; // Use lower 4 bit nibble
			this._i2c.sendByteSync(this._address, a | this.displayPorts.backlight | c);
			this._i2c.sendByteSync(
				this._address,
				a | this.displayPorts.E | this.displayPorts.backlight | c
			);
			this._i2c.sendByteSync(this._address, a | this.displayPorts.backlight | c);
			sleep.usleep(2000);
			return this;
		};
		this.lcd._write4Async = function (x, c, cb) {
			const a = (x >> 4) & 0x0f; // Use lower 4 bit nibble
			this._sendByte(a | this.displayPorts.backlight | c)
				.then(() => this._sendByte(a | this.displayPorts.E | this.displayPorts.backlight | c))
				.catch(e => {
					if (cb) {
						cb(e);
					}
				})
				.then(() => this._sendByte(a | this.displayPorts.backlight | c))
				.catch(e => {
					if (cb) {
						cb(e);
					}
				})
				.then(
					() => {
						if (cb) {
							cb();
						}
					},
					e => {
						if (cb) {
							cb(e);
						}
					}
				);
		};
	}

	/**
	 * Initializes the interface to the LCD screen.
	 * Has to be called before any command.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async initialize() {
		return this.lcd.begin();
	}

	/**
	 * Clears the LCD screen and positions the cursor in the upper-left corner.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async clear() {
		return this.lcd.clear();
	}

	/**
	 * Positions the cursor in the upper-left of the LCD.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async home() {
		return this.lcd.home();
	}

	/**
	 * Positions the LCD cursor.
	 *
	 * @async
	 * @param {number} row The row to position the cursor in. Starting with 0.
	 * @param {number} col The column to position the cursor in. Starting with 0.
	 * @returns {Promise<void>}
	 * @throws {Error} If the row or column are out of bounds.
	 */
	async setCursor(row, col) {
		if (row < 0 || row > this.options.height - 1) {
			throw new Error(`Invalid row "${row}". Must be within [0..${this.options.height - 1}]`);
		}
		if (col < 0 || col > this.options.width - 1) {
			throw new Error(`Invalid column "${col}". Must be within [0..${this.options.width - 1}]`);
		}
		return this.lcd.setCursor(col, row);
	}

	/**
	 * Prints text to the LCD on the specified line.
	 *
	 * @param {number} row The row to position the cursor in. Starting with 0.
	 * @param {string} text The text to print. Max length is the width of the LCD.
	 * @returns {Promise<void>}
	 * @throws {Error} If the row or column are out of bounds.
	 * @throws {Error} If the text is too long.
	 */
	async printLine(row, text) {
		if (row < 0 || row > this.options.height - 1) {
			throw new Error(`Invalid row "${row}". Must be within [0..${this.options.height - 1}]`);
		}
		if (text.length > this.options.width) {
			throw new Error(`Invalid row "${row}". Must be within [0..${this.options.height - 1}]`);
		}
		return this.lcd.printLine(row, text);
	}
}

module.exports = {
	DEFAULT_OPTIONS,
	JoyItLCD,
};
