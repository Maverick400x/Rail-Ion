// utils/generatePNR.js

module.exports = function generatePNR() {
    let pnr = '';
    for (let i = 0; i < 10; i++) {
        pnr += Math.floor(Math.random() * 10); // generates 0–9 only
    }
    return pnr;
};