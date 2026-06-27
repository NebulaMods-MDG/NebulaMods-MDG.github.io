const advanced = document.getElementById("advanced");

const blockIdContainer = document.getElementById("blockIdContainer");
const saveStringContainer = document.getElementById("saveStringContainer");

const lengthInput = document.getElementById("width");   // Length
const widthInput = document.getElementById("height");   // Width
const heightInput = document.getElementById("depth");   // Height

const blockIdInput = document.getElementById("blockId");
const saveStringInput = document.getElementById("saveString");

advanced.addEventListener("change", () => {

    if (advanced.checked) {
        blockIdContainer.style.display = "none";
        saveStringContainer.style.display = "block";
    }
    else {
        blockIdContainer.style.display = "block";
        saveStringContainer.style.display = "none";
    }

});

const MAX_DIMENSION = 100;
const MAX_BLOCKS = 150000;

function clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

function getDimensions()
{
    let length = parseInt(lengthInput.value);
    let width = parseInt(widthInput.value);
    let height = parseInt(heightInput.value);

    if (isNaN(length)) length = 1;
    if (isNaN(width)) width = 1;
    if (isNaN(height)) height = 1;

    length = clamp(length, 1, MAX_DIMENSION);
    width = clamp(width, 1, MAX_DIMENSION);
    height = clamp(height, 1, MAX_DIMENSION);

    return {
        length,
        width,
        height
    };
}

function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied CM2 String!");
        })
        .catch(() => {
            alert("Failed to copy.");
        });
}

function generateCube()
{
    const { length, width, height } = getDimensions();

    const copies =
        length *
        width *
        height;

    // ==========================
    // NORMAL MODE
    // ==========================

    if (!advanced.checked)
    {
        let id = parseInt(blockIdInput.value);

        if (isNaN(id) || id < 1 || id > 19)
        {
            alert("Block ID must be 1-19.");
            return;
        }

        if (copies > MAX_BLOCKS)
        {
            alert(
                `Cube contains ${copies.toLocaleString()} blocks.\n\nMaximum is ${MAX_BLOCKS.toLocaleString()}.`
            );
            return;
        }

        const result = [];

        for (let z = 0; z < length; z++)
        {
            for (let x = 0; x < width; x++)
            {
                for (let y = 0; y < height; y++)
                {
                    result.push(
                        `${id},0,${-y},${x},${z},`
                    );
                }
            }
        }

        result[result.length - 1] += "???";

        copy(result.join(";"));

        return;
    }

    // ==========================
    // ADVANCED MODE
    // ==========================

    const input = saveStringInput.value.trim();

    if (!input)
    {
        alert("Paste a save string first.");
        return;
    }

    let cleanedInput =
        input.replace(/\?{3}/g, "");

    let blocks = cleanedInput
        .split(";")
        .map(b => b.trim())
        .filter(Boolean);

    if (blocks.length === 0)
    {
        alert("Invalid save string.");
        return;
    }

    let parsedBlocks = [];

    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;

    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (const block of blocks)
    {
        let parts = block.split(",");

        if (parts.length < 5)
            continue;

        let y = parseFloat(parts[2]);
        let x = parseFloat(parts[3]);
        let z = parseFloat(parts[4]);

        if (
            isNaN(x) ||
            isNaN(y) ||
            isNaN(z)
        )
            continue;

        parsedBlocks.push({
            parts,
            x,
            y,
            z
        });

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);

        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
    }

    if (parsedBlocks.length === 0)
    {
        alert("No valid blocks found.");
        return;
    }

    const structureWidth =
        (maxX - minX) + 1;

    const structureHeight =
        (maxY - minY) + 1;

    const structureLength =
        (maxZ - minZ) + 1;

    const totalBlocks =
        parsedBlocks.length *
        length *
        width *
        height;

    if (totalBlocks > MAX_BLOCKS)
    {
        alert(
            `This cube would contain ${totalBlocks.toLocaleString()} blocks.\n\nMaximum is ${MAX_BLOCKS.toLocaleString()}.`
        );

        return;
    }

    const result = [];

    for (let z = 0; z < length; z++)
    {
        for (let x = 0; x < width; x++)
        {
            for (let y = 0; y < height; y++)
            {
                const offsetX =
                    x * structureWidth;

                const offsetY =
                    -(y * structureHeight);

                const offsetZ =
                    z * structureLength;

                for (const block of parsedBlocks)
                {
                    let parts = [...block.parts];

                    parts[2] =
                        block.y + offsetY;

                    parts[3] =
                        block.x + offsetX;

                    parts[4] =
                        block.z + offsetZ;

                    if (parts.length > 5)
                    {
                        parts[5] =
                            parts[5].replace(/\?{3}/g, "");
                    }

                    result.push(
                        parts.join(",")
                    );
                }
            }
        }
    }

    if (result.length === 0)
    {
        alert("Nothing generated.");
        return;
    }

    result[result.length - 1] += "???";

    copy(result.join(";"));
}
