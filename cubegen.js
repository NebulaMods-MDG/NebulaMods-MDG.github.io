const advanced = document.getElementById("advanced");

const blockIdContainer = document.getElementById("blockIdContainer");
const saveStringContainer = document.getElementById("saveStringContainer");

const lengthInput = document.getElementById("width");
const widthInput  = document.getElementById("height");
const heightInput = document.getElementById("depth");

const blockIdInput = document.getElementById("blockId");
const saveStringInput = document.getElementById("saveString");

// ---------- Advanced Toggle ----------

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

// ---------- Constants ----------

const MAX_DIMENSION = 100;
const MAX_BLOCKS = 150000;

// ---------- Utility ----------

function clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

function getDimensions()
{
    let width = parseInt(widthInput.value);
    let height = parseInt(heightInput.value);
    let depth = parseInt(depthInput.value);

    if (isNaN(width)) width = 1;
    if (isNaN(height)) height = 1;
    if (isNaN(depth)) depth = 1;

    width = clamp(width,1,MAX_DIMENSION);
    height = clamp(height,1,MAX_DIMENSION);
    depth = clamp(depth,1,MAX_DIMENSION);

    return {
        width,
        height,
        depth
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

// ---------- Generate ----------

function generateCube()
{
    const length = parseInt(widthInput.value) || 1;
const width = parseInt(heightInput.value) || 1;
const height = parseInt(depthInput.value) || 1;

    const { width, height, depth } = getDimensions();

    // total copies
    const copies = length * width * height;

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
for (let z = 0; z < depth; z++)
        {
            for (let x = 0; x < width; x++)
            {
                for (let y = 0; y < height; y++)
                {
                    // Match CM2 coordinate style
                    const cm2Y = -y;
                    const cm2X = x;
                    const cm2Z = z;

                    result.push(
                        `${id},0,${cm2Y},${cm2X},${cm2Z},`
                    );
                }
            }
        }

        // Add ??? to ONLY the final block
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

    // Remove every existing ???
    let cleanedInput = input.replace(/\?{3}/g, "");

    // Split into blocks
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

        // CM2 blocks need at least:
        // ID,ROT,Y,X,Z,...
        if (parts.length < 5)
            continue;

        let y = parseFloat(parts[2]);
        let x = parseFloat(parts[3]);
        let z = parseFloat(parts[4]);

        if (isNaN(x) || isNaN(y) || isNaN(z))
            continue;

        parsedBlocks.push({
            parts,
            x,
            y,
            z
        });

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;

        if (y < minY) minY = y;
        if (y > maxY) maxY = y;

        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
    }

    if (parsedBlocks.length === 0)
    {
        alert("No valid blocks were found.");
        return;
    }

    // ==========================
    // Determine structure size
    // ==========================

    const structureWidth =
        (maxX - minX) + 1;

    const structureHeight =
        (maxY - minY) + 1;

    const structureDepth =
        (maxZ - minZ) + 1;

    // ==========================
    // Block limit
    // ==========================

    const totalBlocks =
        parsedBlocks.length *
        width *
        height *
        depth;

    if (totalBlocks > MAX_BLOCKS)
    {
        alert(
            `This cube would contain ${totalBlocks.toLocaleString()} blocks.\n\nMaximum is ${MAX_BLOCKS.toLocaleString()}.`
        );

        return;
    }

    // Result array
    const result = [];
for (let z = 0; z < depth; z++)
    {
        for (let x = 0; x < width; x++)
        {
            for (let y = 0; y < height; y++)
            {
                // Offset by the size of the pasted structure
                const offsetX = x * structureWidth;
                const offsetY = -(y * structureHeight);
                const offsetZ = z * structureDepth;

                for (const block of parsedBlocks)
                {
                    let parts = [...block.parts];

                    // Apply offsets
                    parts[2] = block.y + offsetY;
                    parts[3] = block.x + offsetX;
                    parts[4] = block.z + offsetZ;

                    // Remove accidental ??? if present
                    if (parts.length > 5)
                    {
                        parts[5] = parts[5].replace(/\?{3}/g, "");
                    }

                    result.push(parts.join(","));
                }
            }
        }
    }

    if (result.length === 0)
    {
        alert("Nothing was generated.");
        return;
    }

    // Add ??? only to the final block
    result[result.length - 1] += "???";

    copy(result.join(";"));
}
