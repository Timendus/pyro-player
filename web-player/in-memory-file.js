class InMemoryFile {

  constructor({file, type}) {
    this.file     = file;
    this.type     = type;
    this.contents = null;
    return this._loadContents();
  }

  _loadContents() {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener('load', (e) => {
        this.contents = e.target.result;
        if ( this.type == 'subtitles' )
          this.contents = this._parseSRTFile(this.contents);
        resolve(this);
      });
      if ( this.type == 'media' )
        reader.readAsDataURL(this.file);
      else
        reader.readAsText(this.file);
    });
  }

  _parseSRTFile(file) {
    let match, subs = [];
    let iterator = file.matchAll(/\d\r?\n(\d+):(\d+):(\d+),(\d+)\s.*\r?\n(.*)\r?\n/g);

    // TODO: is this the best way to iterate over regexp matches?
    while ( !(match = iterator.next()).done ) {
      let [_, h, m, s, ms, value] = match.value;
      const label = 3600*h + 60*m + 1*s + 0.001*ms;
      subs.push([label, value]);
    }

    return subs;
  }

}
