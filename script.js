const advanced = document.getElementById("advanced");

const normalMode = document.getElementById("normalMode");
const advancedMode = document.getElementById("advancedMode");

const blockId = document.getElementById("blockId");
const amount = document.getElementById("amount");
const saveInput = document.getElementById("saveInput");

// toggle mode
advanced.addEventListener("change", () => {
    if (advanced.checked) {
        normalMode.style.display = "none";
        advancedMode.style.display = "block";
    } else {
        normalMode.style.display = "block";
        advancedMode.style.display = "block";
        advancedMode.style.display = "none";
    }
});

function generateAndCopy() {

    let count = Math.min(100, Math.max(1, parseInt(amount.value) || 1));
    let result = [];

    if (!advanced.checked) {

        let id = parseInt(blockId.value);

        if (isNaN(id) || id < 1 || id > 19) {
            alert("Block ID must be 1–19");
            return;
        }

        for (let i = 0; i < count; i++) {
            let yOffset = i * -1;
            let isLast = i === count - 1;
            result.push(`${id},0,${yOffset},0,0,${isLast ? "???" : ""}`);
        }

    } else {

        let input = saveInput.value.trim();

        if (!input) {
            alert("Paste a save string first");
            return;
        }

        let blocks = input.split(";").map(b => b.trim()).filter(Boolean);

        for (let i = 0; i < count; i++) {
            let yOffset = i * -1;

            let clone = blocks.map(block => {
                let parts = block.split(",");

                if (parts.length >= 3) {
                    let y = parseFloat(parts[2]);
                    if (!isNaN(y)) {
                        parts[2] = (y + yOffset);
                    }
                }

                return parts.join(",");
            });

            result.push(clone.join(";"));
        }
    }

    // COPY DIRECTLY (no textbox)
    let finalString = result.join(";");

    navigator.clipboard.writeText(finalString)
        .then(() => {
            alert("Copied CM2 string!");
        })
        .catch(() => {
            alert("Failed to copy!");
        });
}
