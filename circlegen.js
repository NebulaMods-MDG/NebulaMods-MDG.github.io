function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() => alert("Copied CM2 String!"))
        .catch(() => alert("Failed to copy!"));
}

function generateCircle()
{
    const radius =
        parseFloat(document.getElementById("radius").value) || 10;

    const thickness =
        parseFloat(document.getElementById("thickness").value) || 0.5;

    const STEP = 0.000001;
    const LAYERS = 4;
    const SNAP = 0.01;

    const blocks = [];
    const used = new Set();

    for (let layer = 0; layer < LAYERS; layer++)
    {
        const layerOffset =
            (layer - LAYERS / 2) * (thickness / LAYERS);

        const r = radius + layerOffset;

        for (let angle = 0; angle < 360; angle += STEP)
        {
            const rad = angle * Math.PI / 180;

            let x = Math.cos(rad) * r;
            let z = Math.sin(rad) * r;
            x = Math.round(x / SNAP) * SNAP;
            z = Math.round(z / SNAP) * SNAP;

            const key = `${x},${z},${layer}`;

            if (used.has(key))
                continue;

            used.add(key);
            blocks.push(`14,0,${x},0,${z},`);
        }
    }

    if (blocks.length === 0)
    {
        alert("No blocks generated.");
        return;
    }
    blocks[blocks.length - 1] += "???";

    copy(blocks.join(";"));
}
