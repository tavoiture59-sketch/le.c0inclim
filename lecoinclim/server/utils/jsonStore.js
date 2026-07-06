"use strict";

const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

/**
 * Very small file-backed JSON store.
 * - Reads are synchronous-safe (JSON.parse of whole file).
 * - Writes are serialized through a per-file promise queue so two
 *   concurrent requests can never interleave writes and corrupt the file.
 * - Writes are atomic: we write to a temp file then rename() over the
 *   original, so a crash mid-write never leaves a truncated/corrupt file.
 */
class JsonStore {
  constructor(filePath, defaultValue = []) {
    this.filePath = filePath;
    this.defaultValue = defaultValue;
    this._queue = Promise.resolve();
    this._ensureFileSync();
  }

  _ensureFileSync() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(this.defaultValue, null, 2), "utf8");
    }
  }

  async read() {
    try {
      const raw = await fsp.readFile(this.filePath, "utf8");
      return JSON.parse(raw);
    } catch (err) {
      // Corrupt or missing file: fail safe to the default rather than crashing the process.
      return JSON.parse(JSON.stringify(this.defaultValue));
    }
  }

  /**
   * Atomically update the store. `mutator` receives the current array/object
   * and must return the new value to persist.
   */
  async update(mutator) {
    // Chain onto the queue so concurrent calls never race on the same file.
    this._queue = this._queue.then(async () => {
      const current = await this.read();
      const next = await mutator(current);
      const tmpPath = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;
      await fsp.writeFile(tmpPath, JSON.stringify(next, null, 2), "utf8");
      await fsp.rename(tmpPath, this.filePath);
      return next;
    });
    return this._queue;
  }
}

module.exports = JsonStore;
