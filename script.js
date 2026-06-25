const advanced = document.getElementById("advanced");

const normalMode = document.getElementById("normalMode");
const advancedMode = document.getElementById("advancedMode");

const blockId = document.getElementById("blockId");
const amount = document.getElementById("amount");
const saveInput = document.getElementById("saveInput");

const output = document.getElementById("output");

// toggle modes
advanced.addEventListener("change", () => {
    if (advanced.checked) {
        normalMode.style.display = "none";
        advancedMode.style.display = "block";
    } else {
        normalMode.style.display = "block";
        advancedMode.style.display = "none";
    }
});

function generate() {
    let count = parseInt(amount.value);

    if (!count || count < 1) count = 1;
    if (count > 100) count = 100;

    let result = "";

    if (!advanced.checked) {
        // NORMAL MODE
        let id = parseInt(blockId.value);

        if (isNaN(id) || id < 1 || id > 19) {
            output.value = "Block ID must be between 1 and 19";
            return;
        }

        for (let i = 0; i < count; i++) {
            let offset = i === 0 ? 0 : -i;
            result += `${id},0,${offset},0,0,???`;

            if (i !== count - 1) result += ";";
        }

    } else {
        // ADVANCED MODE
        let input = saveInput.value.trim();

        if (!input) {
            output.value = "Paste a save string first";
            return;
        }

        let parts = input.split(";");

        for (let i = 0; i < count; i++) {
            let offset = i === 0 ? 0 : -i;

            let cloned = parts.map(p => {
                let seg = p.split(",");

                // adjust Y position (index 2)
                if (seg.length >= 3) {
                    let y = parseFloat(seg[2]);
                    if (!isNaN(y)) seg[2] = (y + offset).toString();
                }

                return seg.join(",");
            }).join(";");

            result += cloned;

            if (i !== count - 1) result += ";";
        }
    }

    output.value = result;
}

function copyOutput() {
    output.select();
    document.execCommand("copy");
}
