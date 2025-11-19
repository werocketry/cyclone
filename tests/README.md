# Tests

Currently the tests are done manually. To run the tests, follow these steps:

```sh
mkdir tests/outputs/simple-hoop -ErrorAction SilentlyContinue
mkdir tests/outputs/helical-balanced -ErrorAction SilentlyContinue
mkdir tests/outputs/skip-bias -ErrorAction SilentlyContinue
npm run cli -- plan -o tests/outputs/simple-hoop/output.gcode tests/inputs/simple-hoop.wind
npm run cli -- plot -o tests/outputs/simple-hoop/preview.png tests/outputs/simple-hoop/output.gcode
npm run cli -- plan -o tests/outputs/helical-balanced/output.gcode tests/inputs/helical-balanced.wind
npm run cli -- plot -o tests/outputs/helical-balanced/preview.png tests/outputs/helical-balanced/output.gcode
npm run cli -- plan -o tests/outputs/skip-bias/output.gcode tests/inputs/skip-bias.wind
npm run cli -- plot -o tests/outputs/skip-bias/preview.png tests/outputs/skip-bias/output.gcode
```
