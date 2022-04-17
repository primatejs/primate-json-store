import {join} from "path";
import {MemoryStore, File} from "primate";

/*
 * NB
 *
 * This store is a dumb overlay atop Primate.MemoryStore. It feeds its JSON
 * database into `collections` and lets MemoryStore do most of the lifting.
 *
 * Only `save`/`delete` are overwritten, and they're ridiculously inefficient,
 * dumping the entirety of `collections` back into the JSON file.
 *
 * This is not meant for production, rather for experimenting around with
 * persistance if you can't bother with installing a real database like MongoDB.
 */
export default class JSONStore extends MemoryStore {
  get filename() {
    return join(this.path, this.name);
  }

  async open() {
    this.collections = {};
    try {
      // will only work if file exists
      this.collections = JSON.parse(await File.read(this.filename));
    } catch(error) {
      // no error
    }
    return this;
  }

  dump() {
    return File.write(this.filename, JSON.stringify(this.collections));
  }

  save(...args) {
    super.save(...args);
    this.dump();
  }

  delete(...args) {
    super.delete(...args);
    this.dump();
  }
}
