function text(value, aligned=true, autoN=0) {
    const move = aligned ? 1 : 0.45;

    let row = 0;
    let col = 0;

    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        
        switch (char) {
            case "\n":
                row++;
                col = 0;
                break;
            case "\t":
                col += 2;
                break;
            case " ":
                col++;
                if (col > autoN && autoN > 0) {
                    col = 0;
                    row++;
                }
                break;
            default:
                add("text", 0, col * move, 0, row, char);
                col++;
                break;
        }
    }
}
