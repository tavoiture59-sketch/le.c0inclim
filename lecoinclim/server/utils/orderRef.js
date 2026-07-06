"use strict";

const crypto = require("crypto");

/** Generates a reference like CC-7K3F9Q2A using a CSPRNG (not Math.random). */
function genOrderRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let code = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += alphabet[bytes[i] % alphabet.length];
  }
  return `CC-${code}`;
}

module.exports = { genOrderRef };
