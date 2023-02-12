# joy-it-RB-LCD-20x4

This is JavaScript/TypeScript library to access the LCD and input buttons of special LC-displays.
Supported are some displays by [joy-it](https://joy-it.net) with a PCF8574/PCF8574AT i2c adapter chip.

## Setup

1. Plug in the display-shield to your raspberry pi like shown in user manuals.
2. To access the display you first need to enable the i2c kernel module using `raspi-config`. Have a look in the manual (links below) for details.
3. install node.js on the raspberry pi e.g. by using the official install script:

```
	$ curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
	$ sudo apt install nodejs -y
```

4. Install this library with `npm install --save joy-it-rb-lcd-20x4`
5. Run an example script

## Example

```js
const { JoyItLCD } = require('joy-it-rb-lcd-20x4');

async function main() {
	cont lcd = new JoyItLCD();
	await lcd.initialize();

	await lcd.clear();
	await lcd.printLine(0, '********************');
	await lcd.printLine(1, '******* HELLO ******');
	await lcd.printLine(2, '******* WORLD ******');
	await lcd.printLine(3, '********************');
}

(async () => {
	main();
})();
```

## Supported Displays

### RB-LCD-20x4

The [RB-LCD-20x4](https://joy-it.net/en/products/RB-LCD-20x4) is a green monochrome 20x4 character LC-display with 4 additional buttons.

- [RB-LCD-16x2-20x4 Manual English (PDF)](https://joy-it.net/files/files/Produkte/RB-LCD-20x4/RB-LCD-16x2-20x4_Manual_2022-02-22.pdf)
- [Python example code](https://github.com/joy-it/PCF8574-LCD)

```
Pin:  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0
Hex: 80 | 40 | 20 | 10 | 08 | 04 | 02 | 01
Use: EN | -  | RW | RS | D7 | D6 | D5 | D4
```

![product image of the RB-LCD-20x4](https://joy-it.net/files/files/Produkte/RB-LCD-20x4/RB-LCD20x4-01.png)

### RB-LCD-16x2

The [RB-LCD-16x2](https://joy-it.net/en/products/RB-LCD-16x2) should also work but support is untested.

## Unsupported joy-it displays

While this library could be used to access other displays with a PCF8574/PCF8574AT i2c adapter chip we recommend to use the [raspberrypi-liquid-crystal](https://www.npmjs.com/package/raspberrypi-liquid-crystal) library to access these displays.

- [SBC-LCD16x2](https://joy-it.net/en/products/SBC-LCD16x2) - I2C Serial 2.6“ LCD Module
- [SBC-LCD20x4](https://joy-it.net/en/products/SBC-LCD20x4) - I2C Serial 20x4 2004 LCD Module

Displays without an i2c adapter are not supported at all by this class of libraries. These are for example:

- [COM-LCD16X2](https://joy-it.net/en/products/com-LCD16X2)
- [COM-LCD20x4](https://joy-it.net/en/products/COM-LCD20x4)

## License

This library is released under the [GPL-3.0-or-later](./LICENSE.md) license.
